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
    dataTypeOverride: "integer",
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
  references: {
    jsType: "string",
    formTemplate:
      "scaffold-processor/components/table/create-references-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-input.tsx.hbs",
    dataTypeOverride: "text",
    getKeyValueStrForSchema: function (opts: { columnName: string }): string {
      return `${opts.columnName}_id: text(\"${opts.columnName}_id\").references(() => ${opts.columnName}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.columnName);
    },
  },
  file: {
    jsType: "string",
    formTemplate: "scaffold-processor/components/table/create-file.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-file.tsx.hbs",
    dataTypeOverride: "text",
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
    dataTypeOverride: "text",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: text(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.columnName);
    },
  },
};

export class SqliteDialectStrategy implements DbDialectStrategy {
  pkDataType: string = "text";
  createdAtTemplate: string =
    'created_at: text("created_at").default(sql`(CURRENT_DATE)`),';
  updatedAtTemplate: string =
    'updated_at: text("updated_at").default(sql`(CURRENT_DATE)`),';
  pkStrategyTemplates: Record<PkStrategy, string> = {
    uuidv7: `id: text("id").primaryKey().$defaultFn(() => uuidv7()),`,
    uuidv4: `id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),`,
    uuid: `id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),`,
    cuid2: `id: text("id").primaryKey().$defaultFn(() => createId()),`,
    nanoid: `id: text("id").primaryKey().$defaultFn(() => nanoid()),`,
  };
  tableConstructor: string = "sqliteTable";
  dialectConstraintsMap = {
    "pk-auto": ".primaryKey({ autoIncrement: true })",
    "default-now": ".default(sql`(CURRENT_DATE)`)",
  };
  drizzleDbCorePackage: string = "drizzle-orm/sqlite-core";
  dataTypeStrategyMap: DataTypeStrategyMap = sqliteDataTypeStrategies;
  dialect: DbDialect = "sqlite";
}
