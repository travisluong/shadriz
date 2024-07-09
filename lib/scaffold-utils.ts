import {
  GetColumnDefObjsOpts,
  GetKeyValueStrForSchemaOpts,
  ScaffoldUtilOpts,
} from "../lib/types";
import {
  appendToFile,
  capitalize,
  compileTemplate,
  renderTemplate,
} from "../lib/utils";

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
export const scaffoldUtils = {
  execute: function (opts: ScaffoldUtilOpts): void {
    scaffoldUtils.appendCodeToSchema(opts);
    scaffoldUtils.addListView(opts);
    scaffoldUtils.addDetailView(opts);
    scaffoldUtils.addNewView(opts);
    scaffoldUtils.addEditView(opts);
    scaffoldUtils.addDeleteView(opts);
    scaffoldUtils.addCreateAction(opts);
    scaffoldUtils.addUpdateAction(opts);
    scaffoldUtils.addDeleteAction(opts);
    scaffoldUtils.addColumnDef(opts);
    scaffoldUtils.addCreateForm(opts);
    scaffoldUtils.addUpdateForm(opts);
    scaffoldUtils.addDeleteForm(opts);
  },
  appendCodeToSchema: function (opts: ScaffoldUtilOpts): void {
    const { table, columns, schemaTemplatePath } = opts;
    // compile columns
    let columnsCode = "";
    for (const [index, column] of columns.entries()) {
      columnsCode += scaffoldUtils.getKeyValueStrForSchema({ ...opts, column });
      if (index !== columns.length - 1) {
        columnsCode += "\n";
      }
    }
    // compile str
    const str = compileTemplate({
      inputPath: schemaTemplatePath,
      data: { table, columns: columnsCode, typeName: capitalize(table) },
    });

    appendToFile("lib/schema.ts", str);
  },
  getKeyValueStrForSchema: function (
    opts: GetKeyValueStrForSchemaOpts
  ): string {
    const { column, dataTypeStrategyMap } = opts;
    const [columnName, dataType, arg1, arg2, arg3] = column.split(":");
    const args = [arg1, arg2, arg3];
    if (!(dataType in dataTypeStrategyMap)) {
      throw new Error("data type strategy not found: " + dataType);
    }
    const strategy = dataTypeStrategyMap[dataType];
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
  addListView: function (opts: ScaffoldUtilOpts): void {
    renderTemplate({
      inputPath: "app/table/page.tsx.hbs",
      outputPath: `app/${opts.table}/page.tsx`,
      data: { table: opts.table },
    });
  },
  addDetailView: function (opts: ScaffoldUtilOpts): void {
    renderTemplate({
      inputPath: "app/table/[id]/page.tsx.hbs",
      outputPath: `app/${opts.table}/[id]/page.tsx`,
      data: { table: opts.table },
    });
  },
  addEditView: function (opts: ScaffoldUtilOpts): void {
    renderTemplate({
      inputPath: "app/table/[id]/edit/page.tsx.hbs",
      outputPath: `app/${opts.table}/[id]/edit/page.tsx`,
      data: { table: opts.table, capitalizedTable: capitalize(opts.table) },
    });
  },
  addNewView: function (opts: ScaffoldUtilOpts): void {
    renderTemplate({
      inputPath: "app/table/new/page.tsx.hbs",
      outputPath: `app/${opts.table}/new/page.tsx`,
      data: { table: opts.table, capitalizedTable: capitalize(opts.table) },
    });
  },
  addDeleteView: function (opts: ScaffoldUtilOpts): void {
    renderTemplate({
      inputPath: "app/table/[id]/delete/page.tsx.hbs",
      outputPath: `app/${opts.table}/[id]/delete/page.tsx`,
      data: { table: opts.table, capitalizedTable: capitalize(opts.table) },
    });
  },
  addCreateAction: function (opts: ScaffoldUtilOpts): void {
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
  addUpdateAction: function (opts: ScaffoldUtilOpts): void {
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
  addDeleteAction: function (opts: ScaffoldUtilOpts): void {
    renderTemplate({
      inputPath: "actions/table/delete-table.ts.hbs",
      outputPath: `actions/${opts.table}/delete-${opts.table}.ts`,
      data: { table: opts.table, capitalizedTable: capitalize(opts.table) },
    });
  },
  addColumnDef: function (opts: ScaffoldUtilOpts): void {
    let columnDefs = "";
    for (const [index, str] of opts.columns.entries()) {
      const [columnName, dataType] = str.split(":");
      columnDefs += scaffoldUtils.getColumnDefObjs({
        columnName: columnName,
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
  getColumnDefObjs: function ({ columnName }: GetColumnDefObjsOpts) {
    let code = "  {\n";
    code += `    accessorKey: "${columnName}",\n`;
    code += `    header: "${columnName}",\n`;
    code += "  },";
    return code;
  },
  addCreateForm: function (opts: ScaffoldUtilOpts): void {
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
  getFormControlsHtml: function (opts: ScaffoldUtilOpts): string {
    let html = "";
    for (const [index, column] of opts.columns.entries()) {
      const [columnName, dataType, arg1, arg2, arg3] = column.split(":");
      if (columnName === "id") continue;
      if (!(dataType in opts.dataTypeStrategyMap))
        throw new Error("invalid data type strategy: " + dataType);
      const args = [arg1, arg2, arg3];
      if (args.includes("pk")) continue;
      const dataTypeStrategy = opts.dataTypeStrategyMap[dataType];
      html += compileTemplate({
        inputPath: dataTypeStrategy.formTemplate,
        data: { column: columnName },
      });
      if (index !== opts.columns.length - 1) html += "\n";
    }
    return html;
  },
  addUpdateForm: function (opts: ScaffoldUtilOpts): void {
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
  addDeleteForm: function (opts: ScaffoldUtilOpts): void {
    renderTemplate({
      inputPath: "components/table/delete-form.tsx.hbs",
      outputPath: `components/${opts.table}/${opts.table}-delete-form.tsx`,
      data: {
        table: opts.table,
        capitalizedTable: capitalize(opts.table),
      },
    });
  },
  getUpdateFormControlsHtml: function (opts: ScaffoldUtilOpts): string {
    let html = "";
    for (const [index, column] of opts.columns.entries()) {
      const [columnName, dataType, arg1, arg2, arg3] = column.split(":");
      if (columnName === "id") continue;
      if (!(dataType in opts.dataTypeStrategyMap))
        throw new Error("invalid data type strategy: " + dataType);
      const args = [arg1, arg2, arg3];
      if (args.includes("pk")) continue;
      const dataTypeStrategy = opts.dataTypeStrategyMap[dataType];
      html += compileTemplate({
        inputPath: dataTypeStrategy.updateFormTemplate,
        data: { column: columnName },
      });
      if (index !== opts.columns.length - 1) html += "\n";
    }
    return html;
  },
};
