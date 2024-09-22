import {
  DbDialect,
  GetKeyValueStrForSchemaOpts,
  ScaffoldProcessorOpts,
} from "../lib/types";
import {
  compileTemplate,
  renderTemplate,
  insertTextAfter,
  prependToFile,
  checkIfTextExistsInFile,
} from "../lib/utils";
import { log } from "../lib/log";
import { pkStrategyImportTemplates } from "./pk-strategy-processor";
import { caseFactory, Cases } from "../lib/case-utils";

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
  updatedAtKeyValTemplate: string;
}

const scaffoldDbDialectStrategies: Record<
  DbDialect,
  ScaffoldDbDialectStrategy
> = {
  postgresql: {
    schemaTableTemplatePath:
      "scaffold-processor/schema/table.ts.postgresql.hbs",
    updatedAtKeyValTemplate: "updatedAt: new Date(),",
  },
  mysql: {
    schemaTableTemplatePath: "scaffold-processor/schema/table.ts.mysql.hbs",
    updatedAtKeyValTemplate: "updatedAt: new Date(),",
  },
  sqlite: {
    schemaTableTemplatePath: "scaffold-processor/schema/table.ts.sqlite.hbs",
    updatedAtKeyValTemplate: "updatedAt: new Date().toISOString(),",
  },
};

export class ScaffoldProcessor {
  opts: ScaffoldProcessorOpts;

  commonConstraintMap: { [key: string]: string } = {
    pk: ".primaryKey()",
    "default-uuidv7": ".$defaultFn(() => uuidv7())",
    "default-uuidv4": ".$defaultFn(() => crypto.randomUUID())",
  };

  constructor(opts: ScaffoldProcessorOpts) {
    this.opts = opts;
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
    this.insertSchemaToSchemaIndex();
    if (this.opts.authorizationLevel === "admin") {
      this.addLinkToAdminSidebar();
    }
    if (this.opts.authorizationLevel === "private") {
      this.addLinkToDashboardSidebar();
    }
    this.printCompletionMessage();
  }
  addSchema(): void {
    const { table, columns } = this.opts;
    // compile columns
    let columnsCode = "";

    // add primary key id
    const pkCode =
      this.opts.dbDialectStrategy.pkStrategyTemplates[this.opts.pkStrategy];
    columnsCode += "    " + pkCode + "\n";

    // add other columns
    for (const [index, column] of columns.entries()) {
      columnsCode += this.getKeyValueStrForSchema({ ...this.opts, column });
      if (index !== columns.length - 1) {
        columnsCode += "\n";
      }
    }

    // add timestamps
    columnsCode +=
      "\n    " + this.opts.dbDialectStrategy.createdAtTemplate + "\n";
    columnsCode += "    " + this.opts.dbDialectStrategy.updatedAtTemplate;

    // generate imports code
    const importsCode = this.generateImportsCodeFromColumns(columns);
    const tableObj = caseFactory(table);
    renderTemplate({
      inputPath:
        scaffoldDbDialectStrategies[this.opts.dbDialect]
          .schemaTableTemplatePath,
      outputPath: `schema/${tableObj.pluralKebabCase}.ts`,
      data: {
        columns: columnsCode,
        imports: importsCode,
        tableObj: tableObj,
      },
    });
  }
  generateImportsCodeFromColumns(columns: string[]) {
    const dataTypeSet = new Set<string>();
    let referenceImportsCode = "";
    for (const column of columns) {
      const [columnName, dataType] = column.split(":");
      const tableObj = caseFactory(columnName);
      const dataTypeStrategy =
        this.opts.dbDialectStrategy.dataTypeStrategyMap[dataType];
      if (dataTypeStrategy.dataTypeOverride) {
        dataTypeSet.add(dataTypeStrategy.dataTypeOverride);
      } else {
        dataTypeSet.add(dataType);
      }
      if (dataType === "references") {
        referenceImportsCode += `import { ${tableObj.pluralCamelCase} } from "./${tableObj.pluralKebabCase}";\n`;
      }
    }
    let code = "import {\n";
    code += `  ${this.opts.dbDialectStrategy.tableConstructor},\n`;
    if (this.opts.dbDialectStrategy.timestampImport) {
      dataTypeSet.add(this.opts.dbDialectStrategy.timestampImport);
    }
    for (const dataType of dataTypeSet) {
      code += `  ${dataType},\n`;
    }
    code += `} from "${this.opts.dbDialectStrategy.drizzleDbCorePackage}";\n`;
    code += `${pkStrategyImportTemplates[this.opts.pkStrategy]}\n`;
    const dependsOnSql = columns.filter((column) =>
      column.indexOf("sql")
    ).length;
    if (dependsOnSql) {
      code += `import { sql } from "drizzle-orm";`;
    }
    if (referenceImportsCode !== "") {
      code += "\n" + referenceImportsCode;
    }

    return code;
  }
  getKeyValueStrForSchema(opts: GetKeyValueStrForSchemaOpts): string {
    const { column } = opts;
    const { dataTypeStrategyMap } = this.opts.dbDialectStrategy;
    let [columnName, dataType] = column.split(":");
    if (!(dataType in dataTypeStrategyMap)) {
      throw new Error("data type strategy not found: " + dataType);
    }
    const strategy = dataTypeStrategyMap[dataType];
    const columnNameCases = caseFactory(columnName);

    let keyName = columnNameCases.originalCamelCase;
    let referencesTable;
    if (dataType === "references") {
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
    const columnCases = this.getColumnCases();
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
    renderTemplate({
      inputPath: "scaffold-processor/app/table/[id]/edit/page.tsx.hbs",
      outputPath: `app/${this.authorizationRouteGroup()}${
        tableObj.pluralKebabCase
      }/[id]/edit/page.tsx`,
      data: {
        tableObj: tableObj,
        authorizationLevel: this.opts.authorizationLevel,
      },
    });
  }
  addNewView(): void {
    const tableObj = caseFactory(this.opts.table);
    renderTemplate({
      inputPath: "scaffold-processor/app/table/new/page.tsx.hbs",
      outputPath: `app/${this.authorizationRouteGroup()}${
        tableObj.pluralKebabCase
      }/new/page.tsx`,
      data: {
        tableObj: tableObj,
        authorizationLevel: this.opts.authorizationLevel,
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
    for (const col of this.opts.columns.values()) {
      const [columnName, dataType] = col.split(":");
      const columnCases = caseFactory(columnName);
      if (dataType !== "references") {
        columns.push(columnCases.originalCamelCase);
        continue;
      }
      if (dataType === "references") {
        columns.push(columnCases.singularCamelCase + "Id");
      }
    }

    const formDataKeyVal = this.opts.columns
      .map((c) => c.split(":"))
      .map((arr) => {
        const col = arr[0];
        const dataType = arr[1];
        const strategy =
          this.opts.dbDialectStrategy.dataTypeStrategyMap[dataType];

        const columnCases = caseFactory(col);
        let keyName;
        let columnName;

        if (dataType === "references") {
          keyName = columnCases.singularCamelCase + "Id";
          columnName = columnCases.singularCamelCase + "Id";
        } else {
          keyName = columnCases.originalCamelCase;
          columnName = columnCases.originalCamelCase;
        }

        return strategy.getKeyValStrForFormData({
          keyName: keyName,
          columnName: columnName,
        });
      })
      .join("\n");

    const uploadColumnNames = this.opts.columns
      .map((c) => c.split(":"))
      .filter((arr) => this.isFileType(arr) || this.isImageType(arr))
      .map((arr) => caseFactory(arr[0]));

    const tableObj = caseFactory(this.opts.table);

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
      },
    });
  }
  addUpdateAction(): void {
    const columns = ["id"];
    for (const col of this.opts.columns.values()) {
      const [columnName, dataType] = col.split(":");
      const columnCases = caseFactory(columnName);
      if (dataType !== "references") {
        columns.push(columnCases.originalCamelCase);
        continue;
      }
      if (dataType === "references") {
        columns.push(columnCases.singularCamelCase + "Id");
      }
    }

    const dataTypeStrategyForPk =
      this.opts.dbDialectStrategy.dataTypeStrategyMap[
        this.opts.dbDialectStrategy.pkDataType
      ];

    const formDataKeyValArr = this.opts.columns
      .map((c) => c.split(":"))
      .map((arr) => {
        const col = arr[0];
        const dataType = arr[1];
        const strategy =
          this.opts.dbDialectStrategy.dataTypeStrategyMap[dataType];

        const columnCases = caseFactory(col);
        let keyName;
        let columnName;

        if (dataType === "references") {
          keyName = columnCases.singularCamelCase + "Id";
          columnName = columnCases.singularCamelCase + "Id";
        } else {
          keyName = columnCases.originalCamelCase;
          columnName = columnCases.originalCamelCase;
        }

        return strategy.getKeyValStrForFormData({
          keyName: keyName,
          columnName: columnName,
        });
      });

    formDataKeyValArr.unshift(
      dataTypeStrategyForPk.getKeyValStrForFormData({
        keyName: "id",
        columnName: "id",
      })
    );

    const formDataKeyVal = formDataKeyValArr.join("\n");

    const uploadColumnNames = this.opts.columns
      .map((c) => c.split(":"))
      .filter((arr) => this.isFileType(arr) || this.isImageType(arr))
      .map((arr) => caseFactory(arr[0]));

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
        updatedAtKeyValTemplate:
          scaffoldDbDialectStrategies[this.opts.dbDialect]
            .updatedAtKeyValTemplate,
      },
    });
  }
  addDeleteAction(): void {
    const dataTypeStrategyForPk =
      this.opts.dbDialectStrategy.dataTypeStrategyMap[
        this.opts.dbDialectStrategy.pkDataType
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
    renderTemplate({
      inputPath: "scaffold-processor/components/table/create-form.tsx.hbs",
      outputPath: `components/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-create-form.tsx`,
      data: {
        tableObj: tableObj,
        formControls: formControlsHtml,
        authorizationLevel: this.opts.authorizationLevel,
      },
    });
  }
  getFormControlsHtml(): string {
    let html = "";
    for (const [index, column] of this.opts.columns.entries()) {
      const [columnName, dataType] = column.split(":");
      // TODO: validation should go earlier in process
      if (!(dataType in this.opts.dbDialectStrategy.dataTypeStrategyMap))
        throw new Error("invalid data type strategy: " + dataType);
      const dataTypeStrategy =
        this.opts.dbDialectStrategy.dataTypeStrategyMap[dataType];
      const columnCases = caseFactory(columnName);
      html += compileTemplate({
        inputPath: dataTypeStrategy.formTemplate,
        data: { columnCases: columnCases },
      });
      if (index !== this.opts.columns.length - 1) html += "\n";
    }
    return html;
  }
  addUpdateForm(): void {
    const tableObj = caseFactory(this.opts.table);
    const formControlsHtml = this.getUpdateFormControlsHtml();
    renderTemplate({
      inputPath: "scaffold-processor/components/table/update-form.tsx.hbs",
      outputPath: `components/${this.opts.authorizationLevel}/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-update-form.tsx`,
      data: {
        tableObj: tableObj,
        formControls: formControlsHtml,
        authorizationLevel: this.opts.authorizationLevel,
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
  getColumnCases(): Cases[] {
    const arr = [];
    for (const [index, column] of this.opts.columns.entries()) {
      const [columnName, dataType] = column.split(":");
      if (dataType === "references") {
        const columnCases = caseFactory(columnName + "_id");
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
    const columnCases = this.getColumnCases();

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

    for (const [index, column] of this.opts.columns.entries()) {
      const [columnName, dataType] = column.split(":");
      if (!(dataType in this.opts.dbDialectStrategy.dataTypeStrategyMap))
        throw new Error("invalid data type strategy: " + dataType);

      const dataTypeStrategy =
        this.opts.dbDialectStrategy.dataTypeStrategyMap[dataType];

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
  insertSchemaToSchemaIndex() {
    const tableObj = caseFactory(this.opts.table);
    if (
      checkIfTextExistsInFile(
        "lib/schema.ts",
        `@/schema/${tableObj.pluralKebabCase}`
      )
    ) {
      log.bgYellow(`${tableObj.pluralKebabCase} exists in schema.ts`);
      return;
    }
    prependToFile(
      "lib/schema.ts",
      `import * as ${tableObj.pluralCamelCase} from "@/schema/${tableObj.pluralKebabCase}";\n`
    );
    insertTextAfter(
      "lib/schema.ts",
      "export const schema = {",
      `\n  ...${tableObj.pluralCamelCase},`
    );
  }
  addLinkToAdminSidebar() {
    const tableObj = caseFactory(this.opts.table);
    insertTextAfter(
      "components/admin/admin-sidebar.tsx",
      "const SIDEBAR_LINKS = [",
      `\n  { href: "/admin/${tableObj.pluralKebabCase}", display: "${tableObj.pluralCapitalCase}", icon: <DashboardIcon /> },`
    );
  }
  addLinkToDashboardSidebar() {
    const tableObj = caseFactory(this.opts.table);
    insertTextAfter(
      "components/private/dashboard-sidebar.tsx",
      "const SIDEBAR_LINKS = [",
      `\n  { href: "/${tableObj.pluralKebabCase}", display: "${tableObj.pluralCapitalCase}", icon: <DashboardIcon /> },`
    );
  }
  printCompletionMessage() {
    log.success("scaffolding success: " + this.opts.table);
    log.reminder();
    log.cmd("npx drizzle-kit generate");
    log.cmd("npx drizzle-kit migrate");
  }
  isFileType(arr: string[]) {
    return arr[1] === "file";
  }
  isImageType(arr: string[]) {
    return arr[1] === "image";
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
