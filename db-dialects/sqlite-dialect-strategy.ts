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

const sqliteDataTypeStrategies: DataTypeStrategyMap = {
  integer: {
    jsType: "number",
    formTemplate: "components/table/input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts) {
      return `integer("${opts.columnName}")`;
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
};

export class SqliteDialectStrategy extends BaseDbDialectStrategy {
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

  scaffold(opts: ScaffoldOpts): void {
    const scaffoldProcessorOpts: ScaffoldProcessorOpts = {
      ...opts,
      schemaTableTemplatePath: "lib/schema.ts.sqlite.table.hbs",
      dataTypeStrategyMap: sqliteDataTypeStrategies,
    };
    const scaffoldProcessor = new ScaffoldProcessor(scaffoldProcessorOpts);
    scaffoldProcessor.process();
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
}
