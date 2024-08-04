import { formDataUtils } from "../lib/form-data-utils";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  DbDialect,
  DbDialectStrategy,
  PkStrategy,
} from "../lib/types";
import { renderTemplate } from "../lib/utils";

const sqliteDataTypeStrategies: DataTypeStrategyMap = {
  integer: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts) {
      return `${opts.columnName}: integer("${opts.columnName}")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.columnName);
    },
  },
  real: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: real("${opts.columnName}")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.columnName);
    },
  },
  text: {
    jsType: "string",
    formTemplate: "scaffold-processor/components/table/create-textarea.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-textarea.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: text(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
  boolean: {
    jsType: "boolean",
    formTemplate: "scaffold-processor/components/table/create-checkbox.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-checkbox.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: integer("${opts.columnName}", { mode: "boolean" } )`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.boolean(opts.columnName);
    },
  },
  bigint: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: blob("${opts.columnName}", { mode: "bigint" })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.bigint(opts.columnName);
    },
  },
  file: {
    jsType: "string",
    formTemplate: "scaffold-processor/components/table/create-file.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-file.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: text(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
  image: {
    jsType: "string",
    formTemplate: "scaffold-processor/components/table/create-image.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-image.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: text(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
};

export class SqliteDialectStrategy implements DbDialectStrategy {
  fkTextTemplatePath = "stripe-processor/schema/sqlite-fk-text.hbs";
  fkNumberTemplatePath = "stripe-processor/schema/sqlite-fk-number.hbs";
  pkStrategyTemplates: Record<PkStrategy, string> = {
    uuidv7: `id: text("id").notNull().primaryKey().$defaultFn(() => uuidv7()),`,
    uuidv4: `id: text("id").notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),`,
    uuid: `id: text("id").notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),`,
    "auto-increment": `id: integer("id", { mode: "number" }).notNull().primaryKey({ autoIncrement: true }),`,
  };
  stripeSchemaTemplatePath: string =
    "stripe-processor/schema/stripe.ts.sqlite.hbs";
  tableConstructor: string = "sqliteTable";
  dialectArgsMap = {
    "pk-auto": ".primaryKey({ autoIncrement: true })",
    "default-now": ".default(sql`(CURRENT_DATE)`)",
  };
  schemaTableTemplatePath: string =
    "scaffold-processor/schema/table.ts.sqlite.hbs";
  drizzleDbCorePackage: string = "drizzle-orm/sqlite-core";
  dataTypeStrategyMap: DataTypeStrategyMap = sqliteDataTypeStrategies;
  dialect: DbDialect = "sqlite";

  init(): void {
    this.copyDrizzleConfig();
    this.copySchema();
  }

  copyDrizzleConfig(): void {
    renderTemplate({
      inputPath: "db-dialects/drizzle.config.ts.hbs",
      outputPath: "drizzle.config.ts",
      data: { dialect: "sqlite" },
    });
  }

  copySchema(): void {
    renderTemplate({
      inputPath: "db-dialects/lib/schema.ts.sqlite.hbs",
      outputPath: "lib/schema.ts",
    });
  }

  addAuthSchema() {
    renderTemplate({
      inputPath: "db-dialects/schema/user.ts.sqlite.hbs",
      outputPath: "schema/user.ts",
    });
  }
}
