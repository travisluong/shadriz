import {
  GetColumnDefObjsOpts,
  GetKeyValueStrForSchemaOpts,
  ScaffoldProcessorOpts,
} from "./types";
import {
  appendToFile,
  capitalize,
  compileTemplate,
  renderTemplate,
} from "./utils";

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
export class ScaffoldProcessor {
  opts: ScaffoldProcessorOpts;

  constructor(opts: ScaffoldProcessorOpts) {
    this.opts = opts;
  }

  process(): void {
    this.appendCodeToSchema();
    this.addListView();
    this.addDetailView();
    this.addNewView();
    this.addEditView();
    this.addDeleteView();
    this.addCreateAction();
    this.addUpdateAction();
    this.addDeleteAction();
    this.addColumnDef();
    this.addCreateForm();
    this.addUpdateForm();
    this.addDeleteForm();
  }
  appendCodeToSchema(): void {
    const { table, columns, schemaTemplatePath } = this.opts;
    // compile columns
    let columnsCode = "";
    for (const [index, column] of columns.entries()) {
      columnsCode += this.getKeyValueStrForSchema({ ...this.opts, column });
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
  }
  getKeyValueStrForSchema(opts: GetKeyValueStrForSchemaOpts): string {
    const { column, dataTypeStrategyMap } = opts;
    console.log(dataTypeStrategyMap);

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
  }
  addListView(): void {
    renderTemplate({
      inputPath: "app/table/page.tsx.hbs",
      outputPath: `app/${this.opts.table}/page.tsx`,
      data: { table: this.opts.table },
    });
  }
  addDetailView(): void {
    renderTemplate({
      inputPath: "app/table/[id]/page.tsx.hbs",
      outputPath: `app/${this.opts.table}/[id]/page.tsx`,
      data: { table: this.opts.table },
    });
  }
  addEditView(): void {
    renderTemplate({
      inputPath: "app/table/[id]/edit/page.tsx.hbs",
      outputPath: `app/${this.opts.table}/[id]/edit/page.tsx`,
      data: {
        table: this.opts.table,
        capitalizedTable: capitalize(this.opts.table),
      },
    });
  }
  addNewView(): void {
    renderTemplate({
      inputPath: "app/table/new/page.tsx.hbs",
      outputPath: `app/${this.opts.table}/new/page.tsx`,
      data: {
        table: this.opts.table,
        capitalizedTable: capitalize(this.opts.table),
      },
    });
  }
  addDeleteView(): void {
    renderTemplate({
      inputPath: "app/table/[id]/delete/page.tsx.hbs",
      outputPath: `app/${this.opts.table}/[id]/delete/page.tsx`,
      data: {
        table: this.opts.table,
        capitalizedTable: capitalize(this.opts.table),
      },
    });
  }
  addCreateAction(): void {
    const columns = this.opts.columns
      .map((c) => c.split(":")[0])
      .filter((c) => c !== "id");
    renderTemplate({
      inputPath: "actions/table/create-table.ts.hbs",
      outputPath: `actions/${this.opts.table}/create-${this.opts.table}.ts`,
      data: {
        table: this.opts.table,
        capitalizedTable: capitalize(this.opts.table),
        columns: columns,
      },
    });
  }
  addUpdateAction(): void {
    const columns = this.opts.columns
      .map((c) => c.split(":")[0])
      .filter((c) => c !== "id");
    renderTemplate({
      inputPath: "actions/table/update-table.ts.hbs",
      outputPath: `actions/${this.opts.table}/update-${this.opts.table}.ts`,
      data: {
        table: this.opts.table,
        capitalizedTable: capitalize(this.opts.table),
        columns: columns,
      },
    });
  }
  addDeleteAction(): void {
    renderTemplate({
      inputPath: "actions/table/delete-table.ts.hbs",
      outputPath: `actions/${this.opts.table}/delete-${this.opts.table}.ts`,
      data: {
        table: this.opts.table,
        capitalizedTable: capitalize(this.opts.table),
      },
    });
  }
  addColumnDef(): void {
    let columnDefs = "";
    for (const [index, str] of this.opts.columns.entries()) {
      const [columnName, dataType] = str.split(":");
      columnDefs += this.getColumnDefObjs({
        columnName: columnName,
      });
      if (index !== this.opts.columns.length - 1) {
        columnDefs += "\n";
      }
    }
    const capitalizedTableName = capitalize(this.opts.table);
    renderTemplate({
      inputPath: "components/table/columns.tsx.hbs",
      outputPath: `components/${this.opts.table}/${this.opts.table}-columns.tsx`,
      data: {
        columnDefs: columnDefs,
        drizzleInferredType: capitalizedTableName,
        table: this.opts.table,
      },
    });
  }
  getColumnDefObjs({ columnName }: GetColumnDefObjsOpts) {
    let code = "  {\n";
    code += `    accessorKey: "${columnName}",\n`;
    code += `    header: "${columnName}",\n`;
    code += "  },";
    return code;
  }
  addCreateForm(): void {
    const formControlsHtml = this.getFormControlsHtml();
    renderTemplate({
      inputPath: "components/table/create-form.tsx.hbs",
      outputPath: `components/${this.opts.table}/${this.opts.table}-create-form.tsx`,
      data: {
        table: this.opts.table,
        capitalizedTable: capitalize(this.opts.table),
        formControls: formControlsHtml,
      },
    });
  }
  getFormControlsHtml(): string {
    let html = "";
    for (const [index, column] of this.opts.columns.entries()) {
      const [columnName, dataType, arg1, arg2, arg3] = column.split(":");
      if (columnName === "id") continue;
      if (!(dataType in this.opts.dataTypeStrategyMap))
        throw new Error("invalid data type strategy: " + dataType);
      const args = [arg1, arg2, arg3];
      if (args.includes("pk")) continue;
      const dataTypeStrategy = this.opts.dataTypeStrategyMap[dataType];
      html += compileTemplate({
        inputPath: dataTypeStrategy.formTemplate,
        data: { column: columnName },
      });
      if (index !== this.opts.columns.length - 1) html += "\n";
    }
    return html;
  }
  addUpdateForm(): void {
    const formControlsHtml = this.getUpdateFormControlsHtml();
    renderTemplate({
      inputPath: "components/table/update-form.tsx.hbs",
      outputPath: `components/${this.opts.table}/${this.opts.table}-update-form.tsx`,
      data: {
        table: this.opts.table,
        capitalizedTable: capitalize(this.opts.table),
        formControls: formControlsHtml,
      },
    });
  }
  addDeleteForm(): void {
    renderTemplate({
      inputPath: "components/table/delete-form.tsx.hbs",
      outputPath: `components/${this.opts.table}/${this.opts.table}-delete-form.tsx`,
      data: {
        table: this.opts.table,
        capitalizedTable: capitalize(this.opts.table),
      },
    });
  }
  getUpdateFormControlsHtml(): string {
    let html = "";
    for (const [index, column] of this.opts.columns.entries()) {
      const [columnName, dataType, arg1, arg2, arg3] = column.split(":");
      if (columnName === "id") continue;
      if (!(dataType in this.opts.dataTypeStrategyMap))
        throw new Error("invalid data type strategy: " + dataType);
      const args = [arg1, arg2, arg3];
      if (args.includes("pk")) continue;
      const dataTypeStrategy = this.opts.dataTypeStrategyMap[dataType];
      html += compileTemplate({
        inputPath: dataTypeStrategy.updateFormTemplate,
        data: { column: columnName },
      });
      if (index !== this.opts.columns.length - 1) html += "\n";
    }
    return html;
  }
}
