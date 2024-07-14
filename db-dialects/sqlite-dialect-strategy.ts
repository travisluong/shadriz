import { formDataUtils } from "../lib/form-data-utils";
import { log } from "../lib/log";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  DbDialect,
  DbDialectStrategy,
} from "../lib/types";
import { appendToFile, compileTemplate, renderTemplate } from "../lib/utils";

const sqliteDataTypeStrategies: DataTypeStrategyMap = {
  integer: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts) {
      return `${opts.columnName}: integer("${opts.columnName}")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.columnName);
    },
  },
  real: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: real("${opts.columnName}")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.columnName);
    },
  },
  text: {
    jsType: "string",
    formTemplate: "components/table/create-textarea.tsx.hbs",
    updateFormTemplate: "components/table/update-textarea.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: text(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
  boolean: {
    jsType: "boolean",
    formTemplate: "components/table/create-checkbox.tsx.hbs",
    updateFormTemplate: "components/table/update-checkbox.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: integer("${opts.columnName}", { mode: "boolean" } )`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.boolean(opts.columnName);
    },
  },
  bigint: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: blob("${opts.columnName}", { mode: "bigint" })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.bigint(opts.columnName);
    },
  },
};

export class SqliteDialectStrategy implements DbDialectStrategy {
  schemaTableTemplatePath: string = "lib/schema.ts.sqlite.table.hbs";
  dataTypeStrategyMap: DataTypeStrategyMap = sqliteDataTypeStrategies;
  dialect: DbDialect = "sqlite";

  init(): void {
    this.copyDrizzleConfig();
    this.copySchema();
  }

  copyDrizzleConfig(): void {
    renderTemplate({
      inputPath: "drizzle.config.ts.hbs",
      outputPath: "drizzle.config.ts",
      data: { dialect: "sqlite" },
    });
  }

  copySchema(): void {
    renderTemplate({
      inputPath: "lib/schema.ts.sqlite.hbs",
      outputPath: "lib/schema.ts",
    });
  }

  appendAuthSchema() {
    const text = compileTemplate({
      inputPath: "lib/schema.ts.sqlite.auth.hbs",
    });
    appendToFile("lib/schema.ts", text);
  }

  copyCreateUserScript(): void {
    renderTemplate({
      inputPath: "scripts/create-user.ts.better-sqlite3.hbs",
      outputPath: "scripts/create-user.ts",
    });
  }

  printInitCompletionMessage(): void {
    log.success("db setup success: " + this.dialect);
    log.reminder();
    log.cmd("npx shadriz auth -h");
    log.cmd("npx shadriz scaffold -h");
  }

  dialectPkArgHandler(args: string[]): string {
    let str = "";
    if (args.includes("pk-auto")) {
      str += ".primaryKey({ autoIncrement: true })";
    }
    return str;
  }
}
