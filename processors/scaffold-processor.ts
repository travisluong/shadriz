import {
  DbDialect,
  DbDialectStrategy,
  ScaffoldProcessorOpts,
} from "../lib/types";
import {
  compileTemplate,
  renderTemplate,
  insertTextAfterIfNotExists,
  insertSchemaToSchemaIndex,
} from "../lib/utils";
import { log } from "../lib/log";
import { pkStrategyImportTemplates } from "../lib/pk-strategy";
import { caseFactory, Cases } from "../lib/case-utils";
import { dialectStrategyFactory } from "../lib/strategy-factory";

// lib/schema.ts
// app/post/page.tsx
// app/post/[id]/page.tsx
// app/post/[id]/new/page.tsx
// app/post/[id]/edit/page.tsx
// app/post/[id]/delete/page.tsx
// actions/post/create-post.ts
// actions/post/update-post.ts
// actions/post/delete-post.ts
// components/post/post-columns.tsx
// components/post/post-create-form.tsx
// components/post/post-update-form.tsx
// components/post/post-delete-form.tsx

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

interface ValidatedColumn {
  columnName: string;
  dataType: string;
}

export class ScaffoldProcessor {
  opts: ScaffoldProcessorOpts;

  dbDialectStrategy: DbDialectStrategy;

  validatedColumns: ValidatedColumn[];

  constructor(opts: ScaffoldProcessorOpts) {
    this.opts = opts;
    this.dbDialectStrategy = dialectStrategyFactory(opts.dbDialect);
    this.validatedColumns = this.parseColumns(opts.columns);
  }

  parseColumns(columns: string[]) {
    const dataTypeStrategyMap = this.dbDialectStrategy.dataTypeStrategyMap;
    const validatedColumns: ValidatedColumn[] = [];
    for (const column of columns) {
      const [columnName, dataType] = column.split(":");
      if (!(dataType in dataTypeStrategyMap)) {
        throw new Error(`invalid data type ${dataType}`);
      }
      validatedColumns.push({ columnName, dataType });
    }
    return validatedColumns;
  }

  process(): void {
    this.addSchema();
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
    insertSchemaToSchemaIndex(this.opts.table);
    if (this.opts.authorizationLevel === "admin") {
      this.addLinkToAdminSidebar();
    }
    if (this.opts.authorizationLevel === "private") {
      this.addLinkToDashboardSidebar();
    }
    this.printCompletionMessage();
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
    dataTypeSet.add(this.dbDialectStrategy.pkDataType);
    let referenceImportsCode = "";
    let isDecimalTypePresent = false;
    for (const validatedColumn of this.validatedColumns) {
      const { columnName, dataType } = validatedColumn;
      const tableObj = caseFactory(columnName);
      const dataTypeStrategy =
        this.dbDialectStrategy.dataTypeStrategyMap[dataType];
      if (dataTypeStrategy.sqlType) {
        dataTypeSet.add(dataTypeStrategy.sqlType);
      } else {
        dataTypeSet.add(dataType);
      }

      // references
      if (dataType.startsWith("references")) {
        referenceImportsCode += `import { ${tableObj.pluralCamelCase} } from "./${tableObj.pluralKebabCase}";\n`;
      }

      // decimal types
      if (dataType.startsWith("decimal") || dataType.startsWith("numeric")) {
        isDecimalTypePresent = true;
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

    // custom decimal type import
    if (isDecimalTypePresent) {
      code += `import { customDecimal } from "@/lib/custom-types";\n`;
    }

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
    let { columnName, dataType } = validatedColumn;
    const strategy = dataTypeStrategyMap[dataType];
    const columnNameCases = caseFactory(columnName);

    let keyName = columnNameCases.originalCamelCase;
    let referencesTable;
    if (dataType.startsWith("references")) {
      referencesTable = columnNameCases.pluralCamelCase;
      columnName = columnNameCases.singularSnakeCase + "_id";
      keyName = columnNameCases.singularCamelCase + "Id";
    }

    let str =
      "    " +
      strategy.getKeyValueStrForSchema({
        keyName: keyName,
        columnName: columnName,
        referencesTable,
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
    const columnCases = this.getColumnCaseVariants();
    renderTemplate({
      inputPath: "scaffold-processor/app/table/[id]/page.tsx.hbs",
      outputPath: `app/${this.authorizationRouteGroup()}${
        tableObj.pluralKebabCase
      }/[id]/page.tsx`,
      data: { tableObj: tableObj, columnCases: columnCases },
    });
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
      },
    });
  }
  addCreateAction(): void {
    const columns = ["id"];
    for (const validatedColumn of this.validatedColumns) {
      const { columnName, dataType } = validatedColumn;
      const columnCases = caseFactory(columnName);
      if (dataType.startsWith("references")) {
        columns.push(columnCases.singularCamelCase + "Id");
      } else {
        columns.push(columnCases.originalCamelCase);
      }
    }

    const formDataKeyVal = this.validatedColumns
      .map((validatedColumn) => {
        const { columnName, dataType } = validatedColumn;
        const strategy = this.dbDialectStrategy.dataTypeStrategyMap[dataType];

        const columnCases = caseFactory(columnName);
        let keyName;
        let colName;

        if (dataType.startsWith("references")) {
          keyName = columnCases.singularCamelCase + "Id";
          colName = columnCases.singularCamelCase + "Id";
        } else {
          keyName = columnCases.originalCamelCase;
          colName = columnCases.originalCamelCase;
        }

        return strategy.getKeyValStrForFormData({
          keyName: keyName,
          columnName: colName,
        });
      })
      .join("\n");

    const uploadColumnNames = this.validatedColumns
      .filter((validatedColumn) => validatedColumn.dataType === "file")
      .map((validatedColumn) => caseFactory(validatedColumn.columnName));

    const tableObj = caseFactory(this.opts.table);

    const decimalColumns = this.validatedColumns
      .filter((validatedColumn) =>
        ["decimal", "numeric"].includes(validatedColumn.dataType)
      )
      .map((validatedColumn) => caseFactory(validatedColumn.columnName));

    const hasDecimalColumn = decimalColumns.length > 0;

    renderTemplate({
      inputPath: "scaffold-processor/actions/table/create-action.ts.hbs",
      outputPath: `actions/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/create-${tableObj.singularKebabCase}.ts`,
      data: {
        tableObj: tableObj,
        columns: columns,
        formDataKeyVal: formDataKeyVal,
        isNotPublic: this.opts.authorizationLevel !== "public",
        isPrivate: this.opts.authorizationLevel === "private",
        isAdmin: this.opts.authorizationLevel === "admin",
        uploadColumnNames: uploadColumnNames,
        importFileUtils: uploadColumnNames.length > 0,
        decimalColumns: decimalColumns,
        hasDecimalColumn: hasDecimalColumn,
      },
    });
  }
  addUpdateAction(): void {
    const columns = ["id"];
    for (const validatedColumn of this.validatedColumns) {
      const { columnName, dataType } = validatedColumn;
      const columnCases = caseFactory(columnName);
      if (dataType.startsWith("references")) {
        columns.push(columnCases.singularCamelCase + "Id");
      } else {
        columns.push(columnCases.originalCamelCase);
      }
    }

    const dataTypeStrategyForPk =
      this.dbDialectStrategy.dataTypeStrategyMap[
        this.dbDialectStrategy.pkDataType
      ];

    const formDataKeyValArr = this.validatedColumns.map((validatedColumn) => {
      const { columnName, dataType } = validatedColumn;
      const strategy = this.dbDialectStrategy.dataTypeStrategyMap[dataType];

      const columnCases = caseFactory(columnName);
      let keyName;
      let colName;

      if (dataType.startsWith("references")) {
        keyName = columnCases.singularCamelCase + "Id";
        colName = columnCases.singularCamelCase + "Id";
      } else {
        keyName = columnCases.originalCamelCase;
        colName = columnCases.originalCamelCase;
      }

      return strategy.getKeyValStrForFormData({
        keyName: keyName,
        columnName: colName,
      });
    });

    formDataKeyValArr.unshift(
      dataTypeStrategyForPk.getKeyValStrForFormData({
        keyName: "id",
        columnName: "id",
      })
    );

    const formDataKeyVal = formDataKeyValArr.join("\n");

    const uploadColumnNames = this.validatedColumns
      .filter((validatedColumn) => validatedColumn.dataType === "file")
      .map((validatedColumn) => caseFactory(validatedColumn.columnName));

    const decimalColumns = this.validatedColumns
      .filter((validatedColumn) =>
        ["decimal", "numeric"].includes(validatedColumn.dataType)
      )
      .map((validatedColumn) => caseFactory(validatedColumn.columnName));

    const hasDecimalColumn = decimalColumns.length > 0;

    const tableObj = caseFactory(this.opts.table);

    renderTemplate({
      inputPath: "scaffold-processor/actions/table/update-action.ts.hbs",
      outputPath: `actions/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/update-${tableObj.singularKebabCase}.ts`,
      data: {
        tableObj: tableObj,
        columns: columns,
        formDataKeyVal: formDataKeyVal,
        isNotPublic: this.opts.authorizationLevel !== "public",
        isPrivate: this.opts.authorizationLevel === "private",
        isAdmin: this.opts.authorizationLevel === "admin",
        uploadColumnNames: uploadColumnNames,
        importFileUtils: uploadColumnNames.length > 0,
        decimalColumns: decimalColumns,
        hasDecimalColumn: hasDecimalColumn,
      },
    });
  }
  addDeleteAction(): void {
    const dataTypeStrategyForPk =
      this.dbDialectStrategy.dataTypeStrategyMap[
        this.dbDialectStrategy.pkDataType
      ];

    const formDataKeyVal = dataTypeStrategyForPk.getKeyValStrForFormData({
      keyName: "id",
      columnName: "id",
    });

    const tableObj = caseFactory(this.opts.table);

    renderTemplate({
      inputPath: "scaffold-processor/actions/table/delete-action.ts.hbs",
      outputPath: `actions/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/delete-${tableObj.singularKebabCase}.ts`,
      data: {
        tableObj: tableObj,
        isNotPublic: this.opts.authorizationLevel !== "public",
        isPrivate: this.opts.authorizationLevel === "private",
        isAdmin: this.opts.authorizationLevel === "admin",
        formDataKeyVal: formDataKeyVal,
      },
    });
  }
  addCreateForm(): void {
    const formControlsHtml = this.getFormControlsHtml();
    const tableObj = caseFactory(this.opts.table);
    const referencesColumnList = this.getReferencesColumnList("references_");
    renderTemplate({
      inputPath: "scaffold-processor/components/table/create-form.tsx.hbs",
      outputPath: `components/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-create-form.tsx`,
      data: {
        tableObj: tableObj,
        formControls: formControlsHtml,
        authorizationLevel: this.opts.authorizationLevel,
        referencesColumnList: referencesColumnList,
        hasReferences: referencesColumnList.length > 0,
      },
    });
  }
  getFormControlsHtml(): string {
    let html = "";
    for (const [index, validatedColumn] of this.validatedColumns.entries()) {
      const { columnName, dataType } = validatedColumn;
      const dataTypeStrategy =
        this.dbDialectStrategy.dataTypeStrategyMap[dataType];
      const columnCases = caseFactory(columnName);
      html += compileTemplate({
        inputPath: dataTypeStrategy.formTemplate,
        data: { columnCases: columnCases },
      });
      if (index !== this.opts.columns.length - 1) html += "\n";
    }
    return html;
  }
  getReferencesColumnList(startsWith: "references" | "references_") {
    const referencesColumnList = this.validatedColumns
      .filter((validatedColumn) =>
        validatedColumn.dataType.startsWith(startsWith)
      )
      .map((validatedColumn) => validatedColumn.columnName)
      .map((str) => caseFactory(str));
    return referencesColumnList;
  }
  addUpdateForm(): void {
    const tableObj = caseFactory(this.opts.table);
    const formControlsHtml = this.getUpdateFormControlsHtml();
    const referencesColumnList = this.getReferencesColumnList("references_");
    renderTemplate({
      inputPath: "scaffold-processor/components/table/update-form.tsx.hbs",
      outputPath: `components/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-update-form.tsx`,
      data: {
        tableObj: tableObj,
        formControls: formControlsHtml,
        authorizationLevel: this.opts.authorizationLevel,
        referencesColumnList: referencesColumnList,
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
  getColumnCaseVariants(): Cases[] {
    const arr = [];
    for (const validatedColumn of this.validatedColumns) {
      const { columnName, dataType } = validatedColumn;
      if (dataType.startsWith("references")) {
        const fkColumn = caseFactory(columnName);
        const columnCases = caseFactory(fkColumn.singularSnakeCase + "_id");
        arr.push(columnCases);
      } else {
        const columnCases = caseFactory(columnName);
        arr.push(columnCases);
      }
    }
    return arr;
  }
  addTableComponent(): void {
    const tableObj = caseFactory(this.opts.table);
    const columnCases = this.getColumnCaseVariants();

    renderTemplate({
      inputPath: "scaffold-processor/components/table/table-component.tsx.hbs",
      outputPath: `components/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-table.tsx`,
      data: {
        tableObj: tableObj,
        columnCases: columnCases,
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

    for (const [index, validatedColumn] of this.validatedColumns.entries()) {
      const { columnName, dataType } = validatedColumn;

      const dataTypeStrategy =
        this.dbDialectStrategy.dataTypeStrategyMap[dataType];

      const updateFormTemplate = dataTypeStrategy.updateFormTemplate;

      const columnCases = caseFactory(columnName);

      html += compileTemplate({
        inputPath: updateFormTemplate,
        data: { columnCases: columnCases, tableObj: tableObj },
      });

      if (index !== this.opts.columns.length - 1) html += "\n";
    }
    return html;
  }
  addLinkToAdminSidebar() {
    const tableObj = caseFactory(this.opts.table);
    insertTextAfterIfNotExists(
      "components/admin/admin-sidebar.tsx",
      "const SIDEBAR_LINKS = [",
      `\n  { href: "/admin/${tableObj.pluralKebabCase}", display: "${tableObj.pluralCapitalCase}", icon: <DashboardIcon /> },`
    );
  }
  addLinkToDashboardSidebar() {
    const tableObj = caseFactory(this.opts.table);
    insertTextAfterIfNotExists(
      "components/private/dashboard-sidebar.tsx",
      "const SIDEBAR_LINKS = [",
      `\n  { href: "/${tableObj.pluralKebabCase}", display: "${tableObj.pluralCapitalCase}", icon: <DashboardIcon /> },`
    );
  }
  printCompletionMessage() {
    log.success("scaffold success: " + this.opts.table);
    log.checklist("scaffold checklist");
    log.cmdtask("npx drizzle-kit generate");
    log.cmdtask("npx drizzle-kit migrate");
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
}
