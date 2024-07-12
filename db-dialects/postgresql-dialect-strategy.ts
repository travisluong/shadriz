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

const postgresqlDataTypeStrategies: DataTypeStrategyMap = {
  integer: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: integer(\"${opts.columnName}\")`;
    },
  },
  smallint: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: smallint(\"${opts.columnName}\")`;
    },
  },
  bigint: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: bigint(\"${opts.columnName}\", { mode: "number" })`;
    },
  },
  serial: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: serial(\"${opts.columnName}\")`;
    },
  },
  smallserial: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: smallserial(\"${opts.columnName}\")`;
    },
  },
  bigserial: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: bigserial(\"${opts.columnName}\", { mode: "number" })`;
    },
  },
  boolean: {
    jsType: "boolean",
    formTemplate: "components/table/create-checkbox.tsx.hbs",
    updateFormTemplate: "components/table/update-checkbox.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: boolean(\"${opts.columnName}\")`;
    },
  },
  text: {
    jsType: "string",
    formTemplate: "components/table/create-textarea.tsx.hbs",
    updateFormTemplate: "components/table/update-textarea.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: text(\"${opts.columnName}\")`;
    },
  },
  varchar: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: varchar(\"${opts.columnName}\", { length: 255 })`;
    },
  },
  char: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: char(\"${opts.columnName}\", { length: 255 })`;
    },
  },
  numeric: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: numeric(\"${opts.columnName}\")`;
    },
  },
  decimal: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: decimal(\"${opts.columnName}\")`;
    },
  },
  real: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: real(\"${opts.columnName}\")`;
    },
  },
  doublePrecision: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: doublePrecision(\"${opts.columnName}\")`;
    },
  },
  json: {
    jsType: "object",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: json(\"${opts.columnName}\")`;
    },
  },
  jsonb: {
    jsType: "object",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: jsonb(\"${opts.columnName}\")`;
    },
  },
  time: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: time(\"${opts.columnName}\")`;
    },
  },
  timestamp: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: timestamp(\"${opts.columnName}\")`;
    },
  },
  date: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: date(\"${opts.columnName}\")`;
    },
  },
  uuid: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: uuid(\"${opts.columnName}\")`;
    },
  },
};

export class PostgresqlDialectStrategy implements DbDialectStrategy {
  dialect: DbDialect = "postgresql";

  init(): void {
    this.copyDrizzleConfig();
    this.copySchema();
  }

  copyDrizzleConfig(): void {
    renderTemplate({
      inputPath: "drizzle.config.ts.hbs",
      outputPath: "drizzle.config.ts",
      data: { dialect: "postgresql" },
    });
  }

  copySchema(): void {
    renderTemplate({
      inputPath: "lib/schema.ts.postgresql.hbs",
      outputPath: "lib/schema.ts",
      data: {},
    });
  }

  scaffold(opts: ScaffoldOpts): void {
    const scaffoldProcessorOpts: ScaffoldProcessorOpts = {
      ...opts,
      schemaTableTemplatePath: "lib/schema.ts.postgresql.table.hbs",
      dataTypeStrategyMap: postgresqlDataTypeStrategies,
    };
    const scaffoldProcessor = new ScaffoldProcessor(scaffoldProcessorOpts);
    scaffoldProcessor.process();
  }

  appendAuthSchema() {
    const text = compileTemplate({
      inputPath: "lib/schema.ts.postgresql.auth.hbs",
    });
    appendToFile("lib/schema.ts", text);
  }

  copyCreateUserScript(): void {
    renderTemplate({
      inputPath: "scripts/create-user.ts.pg.hbs",
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
