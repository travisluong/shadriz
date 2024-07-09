import { ScaffoldProcessor } from "../lib/scaffold-processor";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  ScaffoldOpts,
  ScaffoldProcessorOpts,
  ShadrizDBStrategy,
} from "../lib/types";
import { appendDbUrl, renderTemplate, runCommand } from "../lib/utils";

const dataTypeStrategies: DataTypeStrategyMap = {
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
      inputPath: "lib/schema.ts.postgresql.hbs",
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
    const scaffoldProcessorOpts: ScaffoldProcessorOpts = {
      ...opts,
      schemaTemplatePath: "lib/schema.ts.postgresql.table.hbs",
      dataTypeStrategyMap: dataTypeStrategies,
    };
    const scaffoldProcessor = new ScaffoldProcessor(scaffoldProcessorOpts);
    scaffoldProcessor.process();
  },
};
