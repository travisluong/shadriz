import { ScaffoldProcessor } from "../lib/scaffold-processor";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  DialectStrategy,
  ScaffoldOpts,
  ScaffoldProcessorOpts,
} from "../lib/types";
import { renderTemplate } from "../lib/utils";

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

export const postgresqlDialectStrategy: DialectStrategy = {
  dialect: "postgresql",
  init: function (): void {
    postgresqlDialectStrategy.copyDrizzleConfig();
    postgresqlDialectStrategy.copySchema();
  },
  copyDrizzleConfig: function (): void {
    renderTemplate({
      inputPath: "drizzle.config.ts.hbs",
      outputPath: "drizzle.config.ts",
      data: { dialect: "postgresql" },
    });
  },
  copySchema: function (): void {
    renderTemplate({
      inputPath: "lib/schema.ts.postgresql.hbs",
      outputPath: "lib/schema.ts",
      data: {},
    });
  },
  scaffold: function (opts: ScaffoldOpts): void {
    const scaffoldProcessorOpts: ScaffoldProcessorOpts = {
      ...opts,
      schemaTableTemplatePath: "lib/schema.ts.postgresql.table.hbs",
      dataTypeStrategyMap: postgresqlDataTypeStrategies,
    };
    const scaffoldProcessor = new ScaffoldProcessor(scaffoldProcessorOpts);
    scaffoldProcessor.process();
  },
};
