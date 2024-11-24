import { formDataUtils } from "../lib/form-data-utils";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  DbDialectStrategy,
} from "../lib/types";

const sqliteDataTypeStrategies: DataTypeStrategyMap = {
  integer: {
    jsType: "number",
    sqlType: "integer",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts) {
      return `${opts.keyName}: integer()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  real: {
    jsType: "number",
    sqlType: "real",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: real()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  text: {
    jsType: "string",
    sqlType: "text",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  boolean: {
    jsType: "boolean",
    sqlType: "integer",
    formTemplate: "scaffold-processor/components/table/create-checkbox.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-checkbox.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: integer({ mode: "boolean" } )`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.boolean(opts.keyName, opts.columnName);
    },
    formComponents: ["checkbox"],
  },
  bigint: {
    jsType: "number",
    sqlType: "blob",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: blob({ mode: "bigint" })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.bigint(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  timestamp: {
    jsType: "string",
    sqlType: "integer",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input-timestamp.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: integer({ mode: "timestamp" })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  references: {
    jsType: "string",
    sqlType: "text",
    formTemplate:
      "scaffold-processor/components/table/create-references-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text().references(() => ${opts.referencesTable}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  references_combobox: {
    jsType: "string",
    sqlType: "text",
    formTemplate:
      "scaffold-processor/components/table/create-references-combobox.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-combobox.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text().references(() => ${opts.referencesTable}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.keyName, opts.columnName);
    },
    formComponents: ["generic-combobox"],
  },
  references_select: {
    jsType: "string",
    sqlType: "text",
    formTemplate:
      "scaffold-processor/components/table/create-references-select.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-select.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text().references(() => ${opts.referencesTable}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.keyName, opts.columnName);
    },
    formComponents: ["generic-select"],
  },
  file: {
    jsType: "string",
    sqlType: "text",
    formTemplate: "scaffold-processor/components/table/create-file.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-file.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.file(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  text_tiptap: {
    jsType: "string",
    sqlType: "text",
    formTemplate: "tiptap-processor/components/create-tiptap-editor.tsx.hbs",
    updateFormTemplate:
      "tiptap-processor/components/update-tiptap-editor.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
    formComponents: ["tiptap-editor"],
  },
};

export const sqliteDialectStrategy: DbDialectStrategy = {
  pkDataType: "text",
  fkAutoIncrementDataType: "integer",
  createdAtTemplate:
    "createdAt: integer({ mode: \"timestamp\" }).notNull().default(sql`(strftime('%s', 'now'))`),",
  updatedAtTemplate:
    "updatedAt: integer({ mode: \"timestamp\" }).notNull().default(sql`(strftime('%s', 'now'))`).$onUpdate(() => new Date()),",
  pkStrategyTemplates: {
    uuidv7: `id: text().primaryKey().$defaultFn(() => uuidv7()),`,
    uuidv4: `id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),`,
    cuid2: `id: text().primaryKey().$defaultFn(() => createId()),`,
    nanoid: `id: text().primaryKey().$defaultFn(() => nanoid()),`,
    auto_increment: `id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),`,
  },
  pkStrategyDataTypes: {
    cuid2: "text",
    uuidv7: "text",
    uuidv4: "text",
    nanoid: "text",
    auto_increment: "integer",
  },
  fkStrategyTemplates: {
    cuid2: "text()",
    uuidv7: "text()",
    uuidv4: "text()",
    nanoid: "text()",
    auto_increment: "integer()",
  },
  pkStrategyJsType: {
    cuid2: "string",
    uuidv7: "string",
    uuidv4: "string",
    nanoid: "string",
    auto_increment: "number",
  },
  tableConstructor: "sqliteTable",
  drizzleDbCorePackage: "drizzle-orm/sqlite-core",
  dataTypeStrategyMap: sqliteDataTypeStrategies,
  dialect: "sqlite",
  timestampImport: "integer",
};
