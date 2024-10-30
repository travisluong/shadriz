import { formDataUtils } from "../lib/form-data-utils";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  DbDialectStrategy,
} from "../lib/types";

const mysqlDataTypeStrategies: DataTypeStrategyMap = {
  int: {
    jsType: "number",
    sqlType: "int",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: int()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  tinyint: {
    jsType: "number",
    sqlType: "tinyint",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: tinyint()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  smallint: {
    jsType: "number",
    sqlType: "smallint",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: smallint()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  mediumint: {
    jsType: "number",
    sqlType: "mediumint",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: mediumint()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  bigint: {
    jsType: "number",
    sqlType: "bigint",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: bigint({ mode: "number" })`;
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
  decimal: {
    jsType: "number",
    sqlType: "decimal",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: customDecimal()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  double: {
    jsType: "number",
    sqlType: "double",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: double()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  float: {
    jsType: "number",
    sqlType: "float",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: float()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  serial: {
    jsType: "number",
    sqlType: "serial",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: serial()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  binary: {
    jsType: "string",
    sqlType: "",
    formTemplate: "",
    updateFormTemplate: "",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
    formComponents: [],
  },
  varbinary: {
    jsType: "string",
    sqlType: "",
    formTemplate: "",
    updateFormTemplate: "",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
    formComponents: [],
  },
  char: {
    jsType: "string",
    sqlType: "char",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: char()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  varchar: {
    jsType: "string",
    sqlType: "varchar",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: varchar({ length: 255 })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  text: {
    jsType: "string",
    sqlType: "text",
    formTemplate: "scaffold-processor/components/table/create-textarea.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-textarea.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
    formComponents: ["textarea"],
  },
  boolean: {
    jsType: "boolean",
    sqlType: "boolean",
    formTemplate: "scaffold-processor/components/table/create-checkbox.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-checkbox.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: boolean()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.boolean(opts.keyName, opts.columnName);
    },
    formComponents: ["checkbox"],
  },
  date: {
    jsType: "string",
    sqlType: "date",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: date()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  datetime: {
    jsType: "string",
    sqlType: "datetime",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input-timestamp.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: datetime()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  time: {
    jsType: "string",
    sqlType: "time",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: time()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  year: {
    jsType: "string",
    sqlType: "year",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: year()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  timestamp: {
    jsType: "string",
    sqlType: "timestamp",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input-timestamp.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: timestamp()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  json: {
    jsType: "object",
    sqlType: "json",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input-json.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: json()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.json(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  references: {
    jsType: "string",
    sqlType: "varchar",
    formTemplate:
      "scaffold-processor/components/table/create-references-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: varchar({ length: 255 }).references(() => ${opts.referencesTable}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
  },
  references_combobox: {
    jsType: "string",
    sqlType: "varchar",
    formTemplate:
      "scaffold-processor/components/table/create-references-combobox.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-combobox.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: varchar({ length: 255 }).references(() => ${opts.referencesTable}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.keyName, opts.columnName);
    },
    formComponents: ["generic-combobox"],
  },
  references_select: {
    jsType: "string",
    sqlType: "varchar",
    formTemplate:
      "scaffold-processor/components/table/create-references-select.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-select.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: varchar({ length: 255 }).references(() => ${opts.referencesTable}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.keyName, opts.columnName);
    },
    formComponents: ["generic-select"],
  },
  file: {
    jsType: "string",
    sqlType: "varchar",
    formTemplate: "scaffold-processor/components/table/create-file.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-file.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: varchar({ length: 255 })`;
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

export const mysqlDialectStrategy: DbDialectStrategy = {
  pkDataType: "varchar",
  createdAtTemplate: `createdAt: timestamp().notNull().defaultNow(),`,
  updatedAtTemplate: `updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),`,
  pkStrategyTemplates: {
    uuidv7: `id: varchar({ length: 255 }).primaryKey().$defaultFn(() => uuidv7()),`,
    uuidv4: `id: varchar({ length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),`,
    cuid2:
      "id: varchar({ length: 255 }).primaryKey().$defaultFn(() => createId()),",
    nanoid: `id: varchar({ length: 255 }).primaryKey().$defaultFn(() => nanoid()),`,
  },
  drizzleDbCorePackage: "drizzle-orm/mysql-core",
  tableConstructor: "mysqlTable",
  dialect: "mysql",
  dataTypeStrategyMap: mysqlDataTypeStrategies,
  timestampImport: "timestamp",
};
