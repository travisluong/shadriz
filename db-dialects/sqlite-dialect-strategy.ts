import { formDataUtils } from "../lib/form-data-utils";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  DbDialect,
  DbDialectStrategy,
  PkStrategy,
} from "../lib/types";

const sqliteDataTypeStrategies: DataTypeStrategyMap = {
  integer: {
    jsType: "number",
    sqlType: "integer",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts) {
      return `${opts.keyName}: integer("${opts.columnName}")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
  },
  real: {
    jsType: "number",
    sqlType: "real",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: real("${opts.columnName}")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.keyName, opts.columnName);
    },
  },
  text: {
    jsType: "string",
    sqlType: "text",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
  },
  boolean: {
    jsType: "boolean",
    sqlType: "integer",
    formTemplate: "scaffold-processor/components/table/create-checkbox.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-checkbox.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: integer("${opts.columnName}", { mode: "boolean" } )`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.boolean(opts.keyName, opts.columnName);
    },
  },
  bigint: {
    jsType: "number",
    sqlType: "blob",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: blob("${opts.columnName}", { mode: "bigint" })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.bigint(opts.keyName, opts.columnName);
    },
  },
  timestamp: {
    jsType: "string",
    sqlType: "integer",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input-timestamp.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: integer(\"${opts.columnName}\", { mode: "timestamp" })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.keyName, opts.columnName);
    },
  },
  references: {
    jsType: "string",
    sqlType: "text",
    formTemplate:
      "scaffold-processor/components/table/create-references-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text(\"${opts.columnName}\").references(() => ${opts.referencesTable}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.keyName, opts.columnName);
    },
  },
  references_combobox: {
    jsType: "string",
    sqlType: "text",
    formTemplate:
      "scaffold-processor/components/table/create-references-combobox.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-combobox.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text(\"${opts.columnName}\").references(() => ${opts.referencesTable}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.keyName, opts.columnName);
    },
  },
  references_select: {
    jsType: "string",
    sqlType: "text",
    formTemplate:
      "scaffold-processor/components/table/create-references-select.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-select.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text(\"${opts.columnName}\").references(() => ${opts.referencesTable}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.keyName, opts.columnName);
    },
  },
  file: {
    jsType: "string",
    sqlType: "text",
    formTemplate: "scaffold-processor/components/table/create-file.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-file.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.file(opts.keyName, opts.columnName);
    },
  },
  image: {
    jsType: "string",
    sqlType: "text",
    formTemplate: "scaffold-processor/components/table/create-image.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-image.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.image(opts.keyName, opts.columnName);
    },
  },
};

export class SqliteDialectStrategy implements DbDialectStrategy {
  pkDataType: string = "text";
  createdAtTemplate: string =
    "createdAt: integer(\"created_at\", { mode: \"timestamp\" }).notNull().default(sql`(strftime('%s', 'now'))`),";
  updatedAtTemplate: string =
    "updatedAt: integer(\"updated_at\", { mode: \"timestamp\" }).notNull().default(sql`(strftime('%s', 'now'))`).$onUpdate(() => new Date()),";
  pkStrategyTemplates: Record<PkStrategy, string> = {
    uuidv7: `id: text("id").primaryKey().$defaultFn(() => uuidv7()),`,
    uuidv4: `id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),`,
    cuid2: `id: text("id").primaryKey().$defaultFn(() => createId()),`,
    nanoid: `id: text("id").primaryKey().$defaultFn(() => nanoid()),`,
  };
  tableConstructor: string = "sqliteTable";
  drizzleDbCorePackage: string = "drizzle-orm/sqlite-core";
  dataTypeStrategyMap: DataTypeStrategyMap = sqliteDataTypeStrategies;
  dialect: DbDialect = "sqlite";
  timestampImport: string = "integer";
}
