import { formDataUtils } from "../lib/form-data-utils";
import { log } from "../lib/log";
import { ScaffoldProcessor } from "../lib/scaffold-processor";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  DbDialect,
  DbDialectStrategy,
  ScaffoldOpts,
  ScaffoldProcessorOpts,
} from "../lib/types";
import { appendToFile, compileTemplate, renderTemplate } from "../lib/utils";

const mysqlDataTypeStrategies: DataTypeStrategyMap = {
  int: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: int(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.columnName);
    },
  },
  tinyint: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: tinyint(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.columnName);
    },
  },
  smallint: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: smallint(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.columnName);
    },
  },
  mediumint: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: mediumint(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.columnName);
    },
  },
  bigint: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: bigint(\"${opts.columnName}\", { mode: "number" })`;
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
      return `${opts.columnName}: real(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.columnName);
    },
  },
  decimal: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: decimal(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
  double: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: double(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.columnName);
    },
  },
  float: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: float(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.columnName);
    },
  },
  serial: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: serial(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.columnName);
    },
  },
  binary: {
    jsType: "string",
    formTemplate: "",
    updateFormTemplate: "",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
  },
  varbinary: {
    jsType: "string",
    formTemplate: "",
    updateFormTemplate: "",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
  },
  char: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: char(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
  varchar: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: varchar(\"${opts.columnName}\", { length: 255 })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
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
      return `${opts.columnName}: boolean(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.boolean(opts.columnName);
    },
  },
  date: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: date(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.columnName);
    },
  },
  datetime: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input-timestamp.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: datetime(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.columnName);
    },
  },
  time: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: time(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
  year: {
    jsType: "string",
    formTemplate: "",
    updateFormTemplate: "",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
  },
  timestamp: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input-timestamp.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: timestamp(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.columnName);
    },
  },
  json: {
    jsType: "object",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input-json.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: json(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.json(opts.columnName);
    },
  },
};

export class MysqlDialectStrategy implements DbDialectStrategy {
  dialect: DbDialect = "mysql";

  init(): void {
    this.copyDrizzleConfig();
    this.copySchema();
  }

  copyDrizzleConfig(): void {
    renderTemplate({
      inputPath: "drizzle.config.ts.hbs",
      outputPath: "drizzle.config.ts",
      data: { dialect: "mysql" },
    });
  }

  copySchema(): void {
    renderTemplate({
      inputPath: "lib/schema.ts.mysql.hbs",
      outputPath: "lib/schema.ts",
      data: {},
    });
  }

  scaffold(opts: ScaffoldOpts): void {
    const scaffoldProcessorOpts: ScaffoldProcessorOpts = {
      ...opts,
      schemaTableTemplatePath: "lib/schema.ts.mysql.table.hbs",
      dataTypeStrategyMap: mysqlDataTypeStrategies,
    };
    const scaffoldProcessor = new ScaffoldProcessor(scaffoldProcessorOpts);
    scaffoldProcessor.process();
  }

  appendAuthSchema() {
    const text = compileTemplate({
      inputPath: "lib/schema.ts.mysql.auth.hbs",
    });
    appendToFile("lib/schema.ts", text);
  }

  copyCreateUserScript(): void {
    renderTemplate({
      inputPath: "scripts/create-user.ts.mysql2.hbs",
      outputPath: "scripts/create-user.ts",
    });
  }

  printInitCompletionMessage() {
    log.success("db setup success: " + this.dialect);
    log.reminder();
    log.dash("update DB_URL in .env.local");
    log.cmd("npx shadriz auth -h");
    log.cmd("npx shadriz scaffold -h");
  }
}
