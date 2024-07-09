import { ScaffoldProcessor } from "../lib/scaffold-processor";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  DialectStrategy,
  ScaffoldOpts,
  ScaffoldProcessorOpts,
} from "../lib/types";
import { renderTemplate } from "../lib/utils";

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

export const sqliteDialectStrategy: DialectStrategy = {
  dialect: "sqlite",
  init: function (): void {
    sqliteDialectStrategy.copyDrizzleConfig();
    sqliteDialectStrategy.copySchema();
  },
  copyDrizzleConfig: function (): void {
    renderTemplate({
      inputPath: "drizzle.config.ts.hbs",
      outputPath: "drizzle.config.ts",
      data: { dialect: "sqlite" },
    });
  },
  copySchema: function (): void {
    renderTemplate({
      inputPath: "lib/schema.ts.sqlite.hbs",
      outputPath: "lib/schema.ts",
      data: {},
    });
  },
  scaffold: function (opts: ScaffoldOpts): void {
    const scaffoldProcessorOpts: ScaffoldProcessorOpts = {
      ...opts,
      schemaTableTemplatePath: "lib/schema.ts.sqlite.table.hbs",
      dataTypeStrategyMap: sqliteDataTypeStrategies,
    };
    const scaffoldProcessor = new ScaffoldProcessor(scaffoldProcessorOpts);
    scaffoldProcessor.process();
  },
};
