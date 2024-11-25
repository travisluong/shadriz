import {
  DbDialect,
  DbDialectStrategy,
  FormComponent,
  PkStrategy,
  ScaffoldProcessorOpts,
} from "../lib/types";
import {
  compileTemplate,
  renderTemplate,
  insertSchemaToSchemaIndex,
  insertTextBeforeIfNotExists,
} from "../lib/utils";
import { log } from "../lib/log";
import { pkStrategyImportTemplates } from "../lib/pk-strategy";
import { caseFactory, Cases } from "../lib/case-utils";
import { dialectStrategyFactory } from "../lib/strategy-factory";

interface ScaffoldDbDialectStrategy {
  schemaTableTemplatePath: string;
}

const scaffoldDbDialectStrategies: Record<
  DbDialect,
  ScaffoldDbDialectStrategy
> = {
  postgresql: {
    schemaTableTemplatePath:
      "scaffold-processor/schema/table.ts.postgresql.hbs",
  },
  mysql: {
    schemaTableTemplatePath: "scaffold-processor/schema/table.ts.mysql.hbs",
  },
  sqlite: {
    schemaTableTemplatePath: "scaffold-processor/schema/table.ts.sqlite.hbs",
  },
};

const formComponentImports: Record<FormComponent, string> = {
  input: `import { Input } from "@/components/ui/input";`,
  textarea: `import { Textarea } from "@/components/ui/textarea";`,
  checkbox: `import { Checkbox } from "@/components/ui/checkbox";`,
  select: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";`,
  "tiptap-editor": `import { TiptapEditor } from "@/components/tiptap-editor";`,
};

interface ValidatedColumn {
  columnName: string; // the original column name passed in from cli
  dataType: string; // the datatype
  caseVariants: Cases; // the case variants of the original column
  zodCode: string; // the zod coersion code
  referenceTableVars?: Cases; // for the table name of reference types
}

const zodCodeRecord: Record<PkStrategy, string> = {
  cuid2: "z.coerce.string().cuid2()",
  uuidv7: "z.coerce.string().uuid()",
  uuidv4: "z.coerce.string().uuid()",
  nanoid: "z.coerce.string().nanoid()",
  auto_increment: "z.coerce.number()",
};

export class ScaffoldProcessor {
  opts: ScaffoldProcessorOpts;

  dbDialectStrategy: DbDialectStrategy;

  validatedColumns: ValidatedColumn[];

  validatedColumnsWithTimestamps: ValidatedColumn[];

  validatedColumnsWithIdAndTimestamps: ValidatedColumn[];

  constructor(opts: ScaffoldProcessorOpts) {
    this.opts = opts;
    this.dbDialectStrategy = dialectStrategyFactory(opts.dbDialect);
    this.validatedColumns = this.parseColumns(opts.columns);
    this.validatedColumnsWithTimestamps =
      this.getValidatedColumnsWithTimestamps();
    this.validatedColumnsWithIdAndTimestamps =
      this.getValidatedColumsWithIdAndTimestamps();
    this.opts.enableSchemaGeneration = opts.enableSchemaGeneration ?? true;
  }

  getValidatedColumsWithIdAndTimestamps() {
    const idCol: ValidatedColumn = {
      columnName: "id",
      dataType: this.dbDialectStrategy.pkDataType,
      caseVariants: caseFactory("id"),
      zodCode: zodCodeRecord[this.opts.pkStrategy],
    };

    return [idCol].concat(this.getValidatedColumnsWithTimestamps());
  }

  getValidatedColumnsWithTimestamps() {
    const createdAtCol: ValidatedColumn = {
      columnName: "created_at",
      dataType: "timestamp",
      caseVariants: caseFactory("created_at"),
      zodCode: this.dbDialectStrategy.dataTypeStrategyMap["timestamp"].zodCode,
    };

    const updatedAtCol: ValidatedColumn = {
      columnName: "updated_at",
      dataType: "timestamp",
      caseVariants: caseFactory("updated_at"),
      zodCode: this.dbDialectStrategy.dataTypeStrategyMap["timestamp"].zodCode,
    };

    return this.validatedColumns.concat([createdAtCol, updatedAtCol]);
  }

  parseColumns(columns: string[]) {
    const dataTypeStrategyMap = this.dbDialectStrategy.dataTypeStrategyMap;
    const validatedColumns: ValidatedColumn[] = [];
    for (const column of columns) {
      let [columnName, dataType] = column.split(":");
      let referenceTableVars;
      if (dataType.startsWith("references")) {
        const inferredReferencesTableName = columnName.split("_id")[0];
        referenceTableVars = caseFactory(inferredReferencesTableName);
      }
      if (!(dataType in dataTypeStrategyMap)) {
        throw new Error(`invalid data type ${dataType}`);
      }
      let zodCode = dataTypeStrategyMap[dataType].zodCode;
      if (dataType.startsWith("references")) {
        zodCode = zodCodeRecord[this.opts.pkStrategy];
      }
      validatedColumns.push({
        columnName,
        dataType,
        caseVariants: caseFactory(columnName),
        referenceTableVars: referenceTableVars,
        zodCode: zodCode,
      });
    }

    return validatedColumns;
  }

  process(): void {
    if (this.opts.enableSchemaGeneration) {
      this.addSchema();
    }
    this.addListView();
    this.addDetailView();
    this.addNewView();
    this.addEditView();
    this.addDeleteView();
    this.addCreateAction();
    this.addUpdateAction();
    this.addDeleteAction();
    this.addCreateForm();
    this.addUpdateForm();
    this.addDeleteForm();
    this.addTableComponent();
    this.addRepository();
    insertSchemaToSchemaIndex(this.opts.table);
    if (this.opts.authorizationLevel === "admin") {
      this.addLinkToAdminSidebar();
    }
    if (this.opts.authorizationLevel === "private") {
      this.addLinkToPrivateSidebar();
    }
    if (this.opts.enableCompletionMessage) {
      this.printCompletionMessage();
    }
  }
  addSchema(): void {
    const { table } = this.opts;
    // compile columns
    let columnsCode = "";

    // add primary key id
    const pkCode =
      this.dbDialectStrategy.pkStrategyTemplates[this.opts.pkStrategy];
    columnsCode += "    " + pkCode + "\n";

    // add other columns
    for (const [index, column] of this.validatedColumns.entries()) {
      columnsCode += this.getKeyValueStrForSchema(column);
      if (index !== this.validatedColumns.length - 1) {
        columnsCode += "\n";
      }
    }

    // add timestamps
    columnsCode += "\n    " + this.dbDialectStrategy.createdAtTemplate + "\n";
    columnsCode += "    " + this.dbDialectStrategy.updatedAtTemplate;

    // generate imports code
    const importsCode = this.generateImportsCodeFromColumns();
    const tableObj = caseFactory(table);
    const referencesColumnList = this.getReferencesColumnList("references");
    renderTemplate({
      inputPath:
        scaffoldDbDialectStrategies[this.opts.dbDialect]
          .schemaTableTemplatePath,
      outputPath: `schema/${tableObj.pluralKebabCase}.ts`,
      data: {
        columns: columnsCode,
        imports: importsCode,
        tableObj: tableObj,
        referencesColumnList: referencesColumnList,
      },
    });
  }
  generateImportsCodeFromColumns() {
    const dataTypeSet = new Set<string>();
    dataTypeSet.add(
      this.dbDialectStrategy.pkStrategyDataTypes[this.opts.pkStrategy]
    );
    let referenceImportsCode = "";
    for (const validatedColumn of this.validatedColumns) {
      const { dataType, referenceTableVars } = validatedColumn;
      const dataTypeStrategy =
        this.dbDialectStrategy.dataTypeStrategyMap[dataType];
      if (dataTypeStrategy.sqlType) {
        dataTypeSet.add(dataTypeStrategy.sqlType);
      } else {
        dataTypeSet.add(dataType);
      }

      // references
      if (dataType.startsWith("references") && referenceTableVars) {
        referenceImportsCode += `import { ${referenceTableVars.pluralCamelCase} } from "./${referenceTableVars.pluralKebabCase}";\n`;
        if (this.opts.pkStrategy === "auto_increment") {
          dataTypeSet.add(this.dbDialectStrategy.fkAutoIncrementDataType);
        }
      }
    }

    // drizzle imports
    let code = "import {\n";
    code += `  ${this.dbDialectStrategy.tableConstructor},\n`;
    if (this.dbDialectStrategy.timestampImport) {
      dataTypeSet.add(this.dbDialectStrategy.timestampImport);
    }
    for (const dataType of dataTypeSet) {
      code += `  ${dataType},\n`;
    }
    code += `} from "${this.dbDialectStrategy.drizzleDbCorePackage}";\n`;

    // pk strategy import
    code += `${pkStrategyImportTemplates[this.opts.pkStrategy]}\n`;

    // reference import
    if (referenceImportsCode !== "") {
      code += "\n" + referenceImportsCode;
    }

    return code;
  }
  getKeyValueStrForSchema(validatedColumn: ValidatedColumn): string {
    const { dataTypeStrategyMap } = this.dbDialectStrategy;
    let { columnName, dataType, caseVariants, referenceTableVars } =
      validatedColumn;
    const strategy = dataTypeStrategyMap[dataType];

    if (dataType.startsWith("references")) {
      columnName = caseVariants.singularSnakeCase;
    }

    let str =
      "    " +
      strategy.getKeyValueStrForSchema({
        keyName: caseVariants.originalCamelCase,
        columnName: columnName,
        referencesTable: referenceTableVars?.pluralCamelCase,
        fkStrategyTemplate:
          this.dbDialectStrategy.fkStrategyTemplates[this.opts.pkStrategy],
      });
    str += ",";
    return str;
  }
  addListView(): void {
    const tableObj = caseFactory(this.opts.table);
    renderTemplate({
      inputPath: "scaffold-processor/app/table/page.tsx.hbs",
      outputPath: `app/${this.authorizationRouteGroup()}${
        tableObj.pluralKebabCase
      }/page.tsx`,
      data: {
        tableObj: tableObj,
        isAdmin: this.opts.authorizationLevel === "admin",
        authorizationLevel: this.opts.authorizationLevel,
      },
    });
  }
  addDetailView(): void {
    const tableObj = caseFactory(this.opts.table);
    const hasFileDataType = this.hasFileDataType();
    renderTemplate({
      inputPath: "scaffold-processor/app/table/[id]/page.tsx.hbs",
      outputPath: `app/${this.authorizationRouteGroup()}${
        tableObj.pluralKebabCase
      }/[id]/page.tsx`,
      data: {
        tableObj: tableObj,
        validatedColumns: this.validatedColumnsWithTimestamps,
        hasFileDataType,
        pkStrategyJsType:
          this.dbDialectStrategy.pkStrategyJsType[this.opts.pkStrategy],
      },
    });
  }
  hasFileDataType() {
    return (
      this.validatedColumns.filter((validatedColumn) =>
        validatedColumn.dataType.startsWith("file")
      ).length > 0
    );
  }
  addEditView(): void {
    const tableObj = caseFactory(this.opts.table);
    const referencesColumnList = this.getReferencesColumnList("references_");
    renderTemplate({
      inputPath: "scaffold-processor/app/table/[id]/edit/page.tsx.hbs",
      outputPath: `app/${this.authorizationRouteGroup()}${
        tableObj.pluralKebabCase
      }/[id]/edit/page.tsx`,
      data: {
        tableObj: tableObj,
        authorizationLevel: this.opts.authorizationLevel,
        referencesColumnList: referencesColumnList,
        pkStrategyJsType:
          this.dbDialectStrategy.pkStrategyJsType[this.opts.pkStrategy],
      },
    });
  }
  addNewView(): void {
    const tableObj = caseFactory(this.opts.table);
    const referencesColumnList = this.getReferencesColumnList("references_");
    renderTemplate({
      inputPath: "scaffold-processor/app/table/new/page.tsx.hbs",
      outputPath: `app/${this.authorizationRouteGroup()}${
        tableObj.pluralKebabCase
      }/new/page.tsx`,
      data: {
        tableObj: tableObj,
        authorizationLevel: this.opts.authorizationLevel,
        referencesColumnList: referencesColumnList,
      },
    });
  }
  addDeleteView(): void {
    const tableObj = caseFactory(this.opts.table);
    renderTemplate({
      inputPath: "scaffold-processor/app/table/[id]/delete/page.tsx.hbs",
      outputPath: `app/${this.authorizationRouteGroup()}${
        tableObj.pluralKebabCase
      }/[id]/delete/page.tsx`,
      data: {
        tableObj: tableObj,
        authorizationLevel: this.opts.authorizationLevel,
        pkStrategyJsType:
          this.dbDialectStrategy.pkStrategyJsType[this.opts.pkStrategy],
      },
    });
  }
  addCreateAction(): void {
    const columns = ["id"];
    for (const validatedColumn of this.validatedColumns) {
      const { caseVariants } = validatedColumn;
      columns.push(caseVariants.originalCamelCase);
    }

    const uploadColumnNames = this.validatedColumns
      .filter((validatedColumn) => validatedColumn.dataType === "file")
      .map((validatedColumn) => caseFactory(validatedColumn.columnName));

    const tableObj = caseFactory(this.opts.table);

    renderTemplate({
      inputPath: "scaffold-processor/actions/table/create-action.ts.hbs",
      outputPath: `actions/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/create-${tableObj.singularKebabCase}.ts`,
      data: {
        tableObj: tableObj,
        columns: columns,
        isNotPublic: this.opts.authorizationLevel !== "public",
        isPrivate: this.opts.authorizationLevel === "private",
        isAdmin: this.opts.authorizationLevel === "admin",
        uploadColumnNames: uploadColumnNames,
        importFileUtils: uploadColumnNames.length > 0,
        validatedColumns: this.validatedColumns,
      },
    });
  }
  addUpdateAction(): void {
    const columns = ["id"];
    for (const validatedColumn of this.validatedColumnsWithTimestamps) {
      const { caseVariants } = validatedColumn;

      columns.push(caseVariants.originalCamelCase);
    }

    const uploadColumnNames = this.validatedColumns
      .filter((validatedColumn) => validatedColumn.dataType === "file")
      .map((validatedColumn) => caseFactory(validatedColumn.columnName));

    const tableObj = caseFactory(this.opts.table);

    renderTemplate({
      inputPath: "scaffold-processor/actions/table/update-action.ts.hbs",
      outputPath: `actions/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/update-${tableObj.singularKebabCase}.ts`,
      data: {
        tableObj: tableObj,
        columns: columns,
        isNotPublic: this.opts.authorizationLevel !== "public",
        isPrivate: this.opts.authorizationLevel === "private",
        isAdmin: this.opts.authorizationLevel === "admin",
        uploadColumnNames: uploadColumnNames,
        importFileUtils: uploadColumnNames.length > 0,
        validatedColumns: this.validatedColumnsWithIdAndTimestamps,
      },
    });
  }
  addDeleteAction(): void {
    const tableObj = caseFactory(this.opts.table);

    renderTemplate({
      inputPath: "scaffold-processor/actions/table/delete-action.ts.hbs",
      outputPath: `actions/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/delete-${tableObj.singularKebabCase}.ts`,
      data: {
        tableObj: tableObj,
        isNotPublic: this.opts.authorizationLevel !== "public",
        isPrivate: this.opts.authorizationLevel === "private",
        isAdmin: this.opts.authorizationLevel === "admin",
        validatedColumns: this.validatedColumnsWithIdAndTimestamps,
      },
    });
  }
  addCreateForm(): void {
    const formControlsImports = this.getFormControlsImports();
    const formControlsHtml = this.getFormControlsHtml();
    const tableObj = caseFactory(this.opts.table);
    const referencesColumnList = this.getReferencesColumnList("references_");
    renderTemplate({
      inputPath: "scaffold-processor/components/table/create-form.tsx.hbs",
      outputPath: `components/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-create-form.tsx`,
      data: {
        tableObj: tableObj,
        formControlsImports: formControlsImports,
        formControls: formControlsHtml,
        authorizationLevel: this.opts.authorizationLevel,
        referencesColumnList: referencesColumnList,
        hasReferences: referencesColumnList.length > 0,
      },
    });
  }
  getFormControlsHtml(): string {
    let html = "";
    const tableObj = caseFactory(this.opts.table);
    for (const [index, validatedColumn] of this.validatedColumns.entries()) {
      const { dataType } = validatedColumn;
      const dataTypeStrategy =
        this.dbDialectStrategy.dataTypeStrategyMap[dataType];
      html += compileTemplate({
        inputPath: dataTypeStrategy.formTemplate,
        data: { validatedColumn: validatedColumn, tableObj },
      });
      if (index !== this.opts.columns.length - 1) html += "\n";
    }
    return html;
  }
  getFormControlsImports(): string {
    let html = "";
    const formComponentSet = new Set<FormComponent>();
    for (const [
      ,
      validatedColumn,
    ] of this.validatedColumnsWithTimestamps.entries()) {
      const { dataType } = validatedColumn;
      const dataTypeStrategy =
        this.dbDialectStrategy.dataTypeStrategyMap[dataType];
      dataTypeStrategy.formComponents.forEach((component) => {
        formComponentSet.add(component);
      });
    }
    formComponentSet.forEach((component) => {
      html += formComponentImports[component] + "\n";
    });
    return html;
  }
  getReferencesColumnList(startsWith: "references" | "references_") {
    const referencesColumnList = this.validatedColumns
      .filter((validatedColumn) =>
        validatedColumn.dataType.startsWith(startsWith)
      )
      .map((validatedColumn) => validatedColumn);
    return referencesColumnList;
  }
  addUpdateForm(): void {
    const tableObj = caseFactory(this.opts.table);
    const formControlsImports = this.getFormControlsImports();
    const formControlsHtml = this.getUpdateFormControlsHtml();
    const referencesColumnList = this.getReferencesColumnList("references_");
    const hasFileDataType = this.hasFileDataType();
    renderTemplate({
      inputPath: "scaffold-processor/components/table/update-form.tsx.hbs",
      outputPath: `components/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-update-form.tsx`,
      data: {
        tableObj: tableObj,
        formControlsImports: formControlsImports,
        formControls: formControlsHtml,
        authorizationLevel: this.opts.authorizationLevel,
        referencesColumnList: referencesColumnList,
        hasFileDataType: hasFileDataType,
      },
    });
  }
  addDeleteForm(): void {
    const tableObj = caseFactory(this.opts.table);
    renderTemplate({
      inputPath: "scaffold-processor/components/table/delete-form.tsx.hbs",
      outputPath: `components/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-delete-form.tsx`,
      data: {
        tableObj: tableObj,
        authorizationLevel: this.opts.authorizationLevel,
      },
    });
  }
  addTableComponent(): void {
    const tableObj = caseFactory(this.opts.table);

    renderTemplate({
      inputPath: "scaffold-processor/components/table/table-component.tsx.hbs",
      outputPath: `components/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-table.tsx`,
      data: {
        tableObj: tableObj,
        validatedColumns: this.validatedColumnsWithTimestamps,
        isAdmin: this.opts.authorizationLevel === "admin",
      },
    });
  }
  getUpdateFormControlsHtml(): string {
    const tableObj = caseFactory(this.opts.table);

    let html = "";

    html += compileTemplate({
      inputPath:
        "scaffold-processor/components/table/update-input-hidden.tsx.hbs",
      data: { tableObj: tableObj },
    });

    html += "\n";

    for (const [
      index,
      validatedColumn,
    ] of this.validatedColumnsWithTimestamps.entries()) {
      const { dataType } = validatedColumn;

      const dataTypeStrategy =
        this.dbDialectStrategy.dataTypeStrategyMap[dataType];

      const updateFormTemplate = dataTypeStrategy.updateFormTemplate;

      html += compileTemplate({
        inputPath: updateFormTemplate,
        data: { validatedColumn: validatedColumn, tableObj: tableObj },
      });

      if (index !== this.validatedColumnsWithTimestamps.length - 1)
        html += "\n";
    }
    return html;
  }
  addLinkToAdminSidebar() {
    const tableObj = caseFactory(this.opts.table);
    insertTextBeforeIfNotExists(
      "components/admin/admin-sidebar.tsx",
      "// [CODE_MARK admin-sidebar-items]",
      `  { title: "${tableObj.pluralCapitalCase}", url: "/admin/${tableObj.pluralKebabCase}", icon: Table2Icon },\n`
    );
  }
  addLinkToPrivateSidebar() {
    const tableObj = caseFactory(this.opts.table);
    insertTextBeforeIfNotExists(
      "components/private/private-sidebar.tsx",
      "// [CODE_MARK private-sidebar-items]",
      `  { title: "${tableObj.pluralCapitalCase}", url: "/${tableObj.pluralKebabCase}", icon: Table2Icon },\n`
    );
  }
  printCompletionMessage() {
    log.success("scaffold success: " + this.opts.table);
    log.checklist("scaffold checklist");
    log.cmdtask("npm run generate");
    log.cmdtask("npm run migrate");
  }
  authorizationRouteGroup() {
    switch (this.opts.authorizationLevel) {
      case "admin":
        return "(admin)/admin/";
      case "private":
        return "(private)/";
      case "public":
        return "(public)/";
      default:
        throw new Error(
          "invalid authorization level " + this.opts.authorizationLevel
        );
    }
  }
  addRepository() {
    const tableObj = caseFactory(this.opts.table);
    renderTemplate({
      inputPath: "scaffold-processor/repositories/table-repository.ts.hbs",
      outputPath: `repositories/${tableObj.singularKebabCase}-repository.ts`,
      data: {
        tableObj,
        pkStrategyJsType:
          this.dbDialectStrategy.pkStrategyJsType[this.opts.pkStrategy],
      },
    });
  }
}
