import { ScaffoldProcessor } from "../lib/scaffold-processor";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  DbDialect,
  ScaffoldOpts,
  ScaffoldProcessorOpts,
} from "../lib/types";
import { appendToFile, compileTemplate, renderTemplate } from "../lib/utils";
import { BaseDbDialectStrategy } from "./base-db-dialect-strategy";

const postgresqlDataTypeStrategies: DataTypeStrategyMap = {
  uuid: {
    jsType: "string",
    formTemplate: "components/table/input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: uuid(\"${opts.columnName}\")`;
    },
  },
  varchar: {
    jsType: "string",
    formTemplate: "components/table/input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: varchar(\"${opts.columnName}\", { length: 255 })`;
    },
  },
  text: {
    jsType: "string",
    formTemplate: "components/table/textarea.tsx.hbs",
    updateFormTemplate: "components/table/update-textarea.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: text(\"${opts.columnName}\")`;
    },
  },
  integer: {
    jsType: "number",
    formTemplate: "components/table/input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: integer(\"${opts.columnName}\")`;
    },
  },
};

export class PostgresqlDialectStrategy extends BaseDbDialectStrategy {
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
}
