import {
  DbDialect,
  GetColumnDefObjsOpts,
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
import { caseFactory } from "../lib/case-utils";

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
    updatedAtKeyValTemplate: "updated_at: new Date(),",
  },
  mysql: {
    schemaTableTemplatePath: "scaffold-processor/schema/table.ts.mysql.hbs",
    updatedAtKeyValTemplate: "updated_at: new Date(),",
  },
  sqlite: {
    schemaTableTemplatePath: "scaffold-processor/schema/table.ts.sqlite.hbs",
    updatedAtKeyValTemplate: "updated_at: new Date().toISOString(),",
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
    this.insertSchemaToSchemaFile();
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
      const dataTypeStrategy =
        this.opts.dbDialectStrategy.dataTypeStrategyMap[dataType];
      if (dataTypeStrategy.dataTypeOverride) {
        dataTypeSet.add(dataTypeStrategy.dataTypeOverride);
      } else {
        dataTypeSet.add(dataType);
      }
      if (dataType === "references") {
        referenceImportsCode += `import { ${columnName} } from "./${columnName}";\n`;
      }
    }
    let code = "import {\n";
    code += `  ${this.opts.dbDialectStrategy.tableConstructor},\n`;
    for (const dataType of dataTypeSet) {
      code += `  ${dataType},\n`;
    }
    code += `} from "${this.opts.dbDialectStrategy.drizzleDbCorePackage}";\n`;
    code += `import { createInsertSchema } from "drizzle-zod";\n`;
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
    const [columnName, dataType, constraints] = column.split(":");
    let constraintsArr: string[] = [];
    if (constraints) {
      constraintsArr = constraints.split(",");
    }
    if (!(dataType in dataTypeStrategyMap)) {
      throw new Error("data type strategy not found: " + dataType);
    }
    this.validateConstraints(constraintsArr);
    const strategy = dataTypeStrategyMap[dataType];
    let str =
      "    " + strategy.getKeyValueStrForSchema({ columnName: columnName });
    for (const arg of constraintsArr) {
      if (arg in this.commonConstraintMap) {
        str += this.commonConstraintMap[arg];
      }
      if (arg in this.opts.dbDialectStrategy.dialectConstraintsMap) {
        str += this.opts.dbDialectStrategy.dialectConstraintsMap[arg];
      }
    }
    // add handler for fk
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
      },
    });
  }
  addDetailView(): void {
    const tableObj = caseFactory(this.opts.table);
    renderTemplate({
      inputPath: "scaffold-processor/app/table/[id]/page.tsx.hbs",
      outputPath: `app/${this.authorizationRouteGroup()}${
        tableObj.pluralKebabCase
      }/[id]/page.tsx`,
      data: { tableObj: tableObj },
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
      },
    });
  }
  addCreateAction(): void {
    const columns = ["id"];
    for (const col of this.opts.columns.values()) {
      const [columnName, dataType] = col.split(":");
      if (
        dataType !== "file" &&
        dataType !== "image" &&
        dataType !== "references"
      ) {
        columns.push(columnName);
        continue;
      }
      if (dataType === "references") {
        columns.push(columnName + "_id");
      }
    }

    const formDataKeyVal = this.opts.columns
      .map((c) => c.split(":"))
      .filter((arr) => !this.isFileType(arr))
      .filter((arr) => !this.isImageType(arr))
      .map((arr) => {
        const col = arr[0];
        const dataType = arr[1];
        const strategy =
          this.opts.dbDialectStrategy.dataTypeStrategyMap[dataType];
        return strategy.getKeyValStrForFormData({ columnName: col });
      })
      .join("\n");

    const uploadColumnNames = this.opts.columns
      .map((c) => c.split(":"))
      .filter((arr) => this.isFileType(arr) || this.isImageType(arr))
      .map((arr) => arr[0]);

    const tableObj = caseFactory(this.opts.table);

    renderTemplate({
      inputPath: "scaffold-processor/actions/table/create-table.ts.hbs",
      outputPath: `actions/${tableObj.pluralKebabCase}/create-${tableObj.singularKebabCase}.ts`,
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
      if (
        dataType !== "file" &&
        dataType !== "image" &&
        dataType !== "references"
      ) {
        columns.push(columnName);
        continue;
      }
      if (dataType === "references") {
        columns.push(columnName + "_id");
      }
    }

    const dataTypeStrategyForPk =
      this.opts.dbDialectStrategy.dataTypeStrategyMap[
        this.opts.dbDialectStrategy.pkDataType
      ];

    const formDataKeyValArr = this.opts.columns
      .map((c) => c.split(":"))
      .filter((arr) => !this.isFileType(arr))
      .filter((arr) => !this.isImageType(arr))
      .map((arr) => {
        const col = arr[0];
        const dataType = arr[1];
        const strategy =
          this.opts.dbDialectStrategy.dataTypeStrategyMap[dataType];
        return strategy.getKeyValStrForFormData({ columnName: col });
      });

    formDataKeyValArr.unshift(
      dataTypeStrategyForPk.getKeyValStrForFormData({
        columnName: "id",
      })
    );

    const formDataKeyVal = formDataKeyValArr.join("\n");

    const uploadColumnNames = this.opts.columns
      .map((c) => c.split(":"))
      .filter((arr) => this.isFileType(arr) || this.isImageType(arr))
      .map((arr) => arr[0]);

    const tableObj = caseFactory(this.opts.table);

    renderTemplate({
      inputPath: "scaffold-processor/actions/table/update-table.ts.hbs",
      outputPath: `actions/${tableObj.pluralKebabCase}/update-${tableObj.singularKebabCase}.ts`,
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
      columnName: "id",
    });

    const tableObj = caseFactory(this.opts.table);

    renderTemplate({
      inputPath: "scaffold-processor/actions/table/delete-table.ts.hbs",
      outputPath: `actions/${tableObj.pluralKebabCase}/delete-${tableObj.singularKebabCase}.ts`,
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
      outputPath: `components/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-create-form.tsx`,
      data: {
        tableObj: tableObj,
        formControls: formControlsHtml,
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
      html += compileTemplate({
        inputPath: dataTypeStrategy.formTemplate,
        data: { column: columnName },
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
      outputPath: `components/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-update-form.tsx`,
      data: {
        tableObj: tableObj,
        formControls: formControlsHtml,
      },
    });
  }
  addDeleteForm(): void {
    const tableObj = caseFactory(this.opts.table);
    renderTemplate({
      inputPath: "scaffold-processor/components/table/delete-form.tsx.hbs",
      outputPath: `components/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-delete-form.tsx`,
      data: {
        tableObj: tableObj,
      },
    });
  }
  addTableComponent(): void {
    const tableObj = caseFactory(this.opts.table);

    const columnNames = [];
    for (const [index, column] of this.opts.columns.entries()) {
      const [columnName, dataType] = column.split(":");
      columnNames.push(columnName);
    }

    renderTemplate({
      inputPath: "scaffold-processor/components/table/table-component.tsx.hbs",
      outputPath: `components/${tableObj.pluralKebabCase}/${tableObj.singularKebabCase}-table.tsx`,
      data: {
        tableObj: tableObj,
        columnNames: columnNames,
      },
    });
  }
  getUpdateFormControlsHtml(): string {
    let html = "";

    html += compileTemplate({
      inputPath:
        "scaffold-processor/components/table/update-input-hidden.tsx.hbs",
      data: { column: "id" },
    });

    html += "\n";

    for (const [index, column] of this.opts.columns.entries()) {
      const [columnName, dataType] = column.split(":");
      if (!(dataType in this.opts.dbDialectStrategy.dataTypeStrategyMap))
        throw new Error("invalid data type strategy: " + dataType);

      const dataTypeStrategy =
        this.opts.dbDialectStrategy.dataTypeStrategyMap[dataType];

      const updateFormTemplate = dataTypeStrategy.updateFormTemplate;

      html += compileTemplate({
        inputPath: updateFormTemplate,
        data: { column: columnName },
      });

      if (index !== this.opts.columns.length - 1) html += "\n";
    }
    return html;
  }
  insertSchemaToSchemaFile() {
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
  validateConstraint(constraint: string): boolean {
    if (constraint === undefined) {
      return true;
    }
    if (constraint in this.commonConstraintMap) {
      return true;
    }
    if (constraint in this.opts.dbDialectStrategy.dialectConstraintsMap) {
      return true;
    }
    return false;
  }
  validateConstraints(constraints: string[]) {
    for (const constraint of constraints) {
      if (!this.validateConstraint(constraint)) {
        throw new Error("invalid constraint " + constraint);
      }
    }
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
