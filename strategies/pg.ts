import {
  DataTypeStrategy,
  DataTypeStrategyOpts,
  ScaffoldOpts,
  ShadrizDBStrategy,
  ShadrizScaffoldUtils,
} from "../lib/types";
import {
  appendDbUrl,
  appendToFile,
  capitalize,
  compileTemplate,
  renderTemplate,
  runCommand,
} from "../lib/utils";

const uuidStrategy: DataTypeStrategy = {
  jsType: "string",
  formTemplate: "components/table/input.tsx.hbs",
  updateFormTemplate: "components/table/update-input.tsx.hbs",
  getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
    return `${opts.columnName}: uuid(\"${opts.columnName}\")`;
  },
};

const varcharStrategy: DataTypeStrategy = {
  jsType: "string",
  formTemplate: "components/table/input.tsx.hbs",
  updateFormTemplate: "components/table/update-input.tsx.hbs",
  getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
    return `${opts.columnName}: varchar(\"${opts.columnName}\", { length: 255 })`;
  },
};

const textStrategy: DataTypeStrategy = {
  jsType: "string",
  formTemplate: "components/table/textarea.tsx.hbs",
  updateFormTemplate: "components/table/update-textarea.tsx.hbs",
  getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
    return `${opts.columnName}: text(\"${opts.columnName}\")`;
  },
};

const integerStrategy: DataTypeStrategy = {
  jsType: "number",
  formTemplate: "components/table/input.tsx.hbs",
  updateFormTemplate: "components/table/update-input.tsx.hbs",
  getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
    return `${opts.columnName}: integer(\"${opts.columnName}\")`;
  },
};

const dataTypeStrategies: { [key: string]: DataTypeStrategy } = {
  uuid: uuidStrategy,
  varchar: varcharStrategy,
  text: textStrategy,
  integer: integerStrategy,
};

export const pgStrategy: ShadrizDBStrategy = {
  installDependencies: async function () {
    await runCommand("npm i pg", []);
    await runCommand("npm i -D @types/pg", []);
  },
  copyDrizzleConfig: function (): void {
    renderTemplate({
      inputPath: "drizzle.config.ts.hbs",
      outputPath: "drizzle.config.ts",
      data: { dialect: "postgresql" },
    });
  },
  copyMigrateScript: function (): void {
    renderTemplate({
      inputPath: "scripts/migrate.ts.pg.hbs",
      outputPath: "scripts/migrate.ts",
      data: {},
    });
  },
  copySchema: function (): void {
    renderTemplate({
      inputPath: "lib/schema.ts.pg.hbs",
      outputPath: "lib/schema.ts",
      data: {},
    });
  },
  appendDbUrl: function (): void {
    appendDbUrl("postgres://user:password@host:port/db");
  },
  copyDbInstance: function (): void {
    renderTemplate({
      inputPath: "lib/db.ts.pg.hbs",
      outputPath: "lib/db.ts",
      data: {},
    });
  },
  scaffold: function (opts: ScaffoldOpts): void {
    // app/posts/page.tsx
    scaffoldUtils.addListView(opts);
    // app/posts/[id]/page.tsx
    scaffoldUtils.addDetailView(opts);
    // app/posts/[id]/new/page.tsx
    scaffoldUtils.addNewView(opts);
    // app/posts/[id]/edit/page.tsx
    scaffoldUtils.addEditView(opts);
    // actions/posts/create-post.ts
    scaffoldUtils.addCreateAction(opts);
    // actions/posts/update-post.ts
    scaffoldUtils.addUpdateAction(opts);
    // actions/posts/delete-post.ts
    scaffoldUtils.addDeleteAction(opts);
    // components/posts/post-form.tsx
    scaffoldUtils.addForm(opts);
    // components/posts/post-columns.tsx
    scaffoldUtils.addColumnDef(opts);
    // add code to schema
    scaffoldUtils.addCodeToSchema(opts);
    // components/posts/post-update-form.tsx
    scaffoldUtils.addUpdateForm(opts);
  },
};

const scaffoldUtils: ShadrizScaffoldUtils = {
  addCodeToSchema: function (opts: ScaffoldOpts): void {
    const { table, columns } = opts;
    // compile columns
    let columnsCode = "";
    for (const [index, column] of columns.entries()) {
      columnsCode += scaffoldUtils.getKeyValueStrForSchema(column);
      if (index !== columns.length - 1) {
        columnsCode += "\n";
      }
    }
    // compile str
    const str = compileTemplate({
      inputPath: "lib/schema.ts.pg.table.hbs",
      data: { table, columns: columnsCode, typeName: capitalize(table) },
    });

    appendToFile("lib/schema.ts", str);
  },
  getKeyValueStrForSchema: function (column: string): string {
    const [columnName, dataType, arg1, arg2, arg3] = column.split(":");
    const args = [arg1, arg2, arg3];
    if (!(dataType in dataTypeStrategies)) {
      throw new Error("data type strategy not found: " + dataType);
    }
    const strategy = dataTypeStrategies[dataType];
    let str =
      "    " + strategy.getKeyValueStrForSchema({ columnName: columnName });
    if (args.includes("pk")) {
      str += ".primaryKey()";
    }
    if (args.includes("defaultuuidv7")) {
      str += ".$defaultFn(() => uuidv7())";
    }
    str += ",";
    return str;
  },
  addListView: function (opts: ScaffoldOpts): void {
    renderTemplate({
      inputPath: "app/table/page.tsx.hbs",
      outputPath: `app/${opts.table}/page.tsx`,
      data: { table: opts.table },
    });
  },
  addDetailView: function (opts: ScaffoldOpts): void {
    renderTemplate({
      inputPath: "app/table/[id]/page.tsx.hbs",
      outputPath: `app/${opts.table}/[id]/page.tsx`,
      data: { table: opts.table },
    });
  },
  addEditView: function (opts: ScaffoldOpts): void {
    renderTemplate({
      inputPath: "app/table/[id]/edit/page.tsx.hbs",
      outputPath: `app/${opts.table}/[id]/edit/page.tsx`,
      data: { table: opts.table, capitalizedTable: capitalize(opts.table) },
    });
  },
  addNewView: function (opts: ScaffoldOpts): void {
    renderTemplate({
      inputPath: "app/table/new/page.tsx.hbs",
      outputPath: `app/${opts.table}/new/page.tsx`,
      data: { table: opts.table, capitalizedTable: capitalize(opts.table) },
    });
  },
  addCreateAction: function (opts: ScaffoldOpts): void {
    const columns = opts.columns
      .map((c) => c.split(":")[0])
      .filter((c) => c !== "id");
    renderTemplate({
      inputPath: "actions/table/create-table.ts.hbs",
      outputPath: `actions/${opts.table}/create-${opts.table}.ts`,
      data: {
        table: opts.table,
        capitalizedTable: capitalize(opts.table),
        columns: columns,
      },
    });
  },
  addUpdateAction: function (opts: ScaffoldOpts): void {
    const columns = opts.columns
      .map((c) => c.split(":")[0])
      .filter((c) => c !== "id");
    renderTemplate({
      inputPath: "actions/table/update-table.ts.hbs",
      outputPath: `actions/${opts.table}/update-${opts.table}.ts`,
      data: {
        table: opts.table,
        capitalizedTable: capitalize(opts.table),
        columns: columns,
      },
    });
  },
  addDeleteAction: function (opts: ScaffoldOpts): void {
    renderTemplate({
      inputPath: "actions/table/delete-table.ts.hbs",
      outputPath: `actions/${opts.table}/delete-${opts.table}.ts`,
      data: { table: opts.table },
    });
  },
  addColumnDef: function (opts: ScaffoldOpts): void {
    let columnDefs = "";
    for (const [index, str] of opts.columns.entries()) {
      const [columnName, dataType] = str.split(":");
      columnDefs += scaffoldUtils.getColumnDefObjs({
        columnName: columnName,
        table: opts.table,
      });
      if (index !== opts.columns.length - 1) {
        columnDefs += "\n";
      }
    }
    const capitalizedTableName = capitalize(opts.table);
    renderTemplate({
      inputPath: "components/table/columns.tsx.hbs",
      outputPath: `components/${opts.table}/${opts.table}-columns.tsx`,
      data: {
        columnDefs: columnDefs,
        drizzleInferredType: capitalizedTableName,
        table: opts.table,
      },
    });
  },
  getColumnDefObjs: function ({
    columnName,
    table,
  }: {
    columnName: string;
    table: string;
  }) {
    let code = "  {\n";
    code += `    accessorKey: "${columnName}",\n`;
    code += `    header: "${columnName}",\n`;

    if (columnName === "id") {
      code += `    cell: ({ row }) => {\n`;
      code += `        const id = row.getValue("id") as string;\n`;
      code += "        return <a href={`/" + table + "/${id}`}>{id}</a>;\n";
      code += "    },\n";
    }

    code += "  },";
    return code;
  },
  addForm: function (opts: ScaffoldOpts): void {
    const formControlsHtml = scaffoldUtils.getFormControlsHtml(opts);
    renderTemplate({
      inputPath: "components/table/create-form.tsx.hbs",
      outputPath: `components/${opts.table}/${opts.table}-create-form.tsx`,
      data: {
        table: opts.table,
        capitalizedTable: capitalize(opts.table),
        formControls: formControlsHtml,
      },
    });
  },
  getFormControlsHtml: function (opts: ScaffoldOpts): string {
    let html = "";
    for (const [index, column] of opts.columns.entries()) {
      const [columnName, dataType, arg1, arg2, arg3] = column.split(":");
      if (columnName === "id") continue;
      if (!(dataType in dataTypeStrategies))
        throw new Error("invalid data type strategy: " + dataType);
      const args = [arg1, arg2, arg3];
      if (args.includes("pk")) continue;
      const dataTypeStrategy = dataTypeStrategies[dataType];
      html += compileTemplate({
        inputPath: dataTypeStrategy.formTemplate,
        data: { column: columnName },
      });
      if (index !== opts.columns.length - 1) html += "\n";
    }
    return html;
  },
  addUpdateForm: function (opts: ScaffoldOpts): void {
    const formControlsHtml = scaffoldUtils.getUpdateFormControlsHtml(opts);
    renderTemplate({
      inputPath: "components/table/update-form.tsx.hbs",
      outputPath: `components/${opts.table}/${opts.table}-update-form.tsx`,
      data: {
        table: opts.table,
        capitalizedTable: capitalize(opts.table),
        formControls: formControlsHtml,
      },
    });
  },
  getUpdateFormControlsHtml: function (opts: ScaffoldOpts): string {
    let html = "";
    for (const [index, column] of opts.columns.entries()) {
      const [columnName, dataType, arg1, arg2, arg3] = column.split(":");
      if (columnName === "id") continue;
      if (!(dataType in dataTypeStrategies))
        throw new Error("invalid data type strategy: " + dataType);
      const args = [arg1, arg2, arg3];
      if (args.includes("pk")) continue;
      const dataTypeStrategy = dataTypeStrategies[dataType];
      html += compileTemplate({
        inputPath: dataTypeStrategy.updateFormTemplate,
        data: { column: columnName },
      });
      if (index !== opts.columns.length - 1) html += "\n";
    }
    return html;
  },
};
