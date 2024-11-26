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
    formComponents: ["input"],
    zodCode: "z.coerce.number()",
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
    formComponents: ["input"],
    zodCode: "z.coerce.number()",
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
    formComponents: ["input"],
    zodCode: "z.coerce.string()",
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
    formComponents: ["checkbox"],
    zodCode: "z.coerce.boolean()",
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
    formComponents: ["input"],
    zodCode: "z.coerce.number()",
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
    formComponents: ["input"],
    zodCode: "z.coerce.date()",
  },
  references: {
    jsType: "string",
    sqlType: "text",
    formTemplate:
      "scaffold-processor/components/table/create-references-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: ${opts.fkStrategyTemplate}.references(() => ${opts.referencesTable}.id)`;
    },
    formComponents: ["input"],
    zodCode: "z.coerce.string()",
  },
  references_select: {
    jsType: "string",
    sqlType: "text",
    formTemplate:
      "scaffold-processor/components/table/create-references-select.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-select.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: ${opts.fkStrategyTemplate}.references(() => ${opts.referencesTable}.id)`;
    },
    formComponents: ["select"],
    zodCode: "z.coerce.string()",
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
    formComponents: ["input"],
    zodCode: "z.coerce.string()",
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
    formComponents: ["tiptap-editor"],
    zodCode: "z.coerce.string()",
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
