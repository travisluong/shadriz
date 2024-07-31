import { formDataUtils } from "../lib/form-data-utils";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  DbDialect,
  DbDialectStrategy,
} from "../lib/types";
import { renderTemplate } from "../lib/utils";

const postgresqlDataTypeStrategies: DataTypeStrategyMap = {
  integer: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: integer(\"${opts.columnName}\")`;
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
  smallserial: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: smallserial(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.columnName);
    },
  },
  bigserial: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: bigserial(\"${opts.columnName}\", { mode: "number" })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.columnName);
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
  char: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: char(\"${opts.columnName}\", { length: 255 })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
  numeric: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: numeric(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
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
  doublePrecision: {
    jsType: "number",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: doublePrecision(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.columnName);
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
  jsonb: {
    jsType: "object",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input-json.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: jsonb(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.json(opts.columnName);
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
  date: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: date(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
  uuid: {
    jsType: "string",
    formTemplate: "components/table/create-input.tsx.hbs",
    updateFormTemplate: "components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: uuid(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
  file: {
    jsType: "string",
    formTemplate: "components/table/create-file.tsx.hbs",
    updateFormTemplate: "components/table/update-file.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: text(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
  image: {
    jsType: "string",
    formTemplate: "components/table/create-image.tsx.hbs",
    updateFormTemplate: "components/table/update-image.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: text(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
};

export class PostgresqlDialectStrategy implements DbDialectStrategy {
  stripeSchemaTemplatePath: string = "stripe/schema/stripe.ts.postgresql.hbs";
  drizzleDbCorePackage: string = "drizzle-orm/pg-core";
  tableConstructor: string = "pgTable";
  dialectArgsMap = {
    "default-now": ".defaultNow()",
  };
  schemaTableTemplatePath: string = "schema/table.ts.postgresql.hbs";
  dataTypeStrategyMap: DataTypeStrategyMap = postgresqlDataTypeStrategies;
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

  addAuthSchema() {
    renderTemplate({
      inputPath: "schema/user.ts.postgresql.hbs",
      outputPath: "schema/user.ts",
    });
  }

  copyCreateUserScript(): void {
    renderTemplate({
      inputPath: "scripts/create-user.ts.pg.hbs",
      outputPath: "scripts/create-user.ts",
    });
  }
}
