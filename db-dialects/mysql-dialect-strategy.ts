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
    zodCode: "z.coerce.number()",
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
    zodCode: "z.coerce.number()",
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
    zodCode: "z.coerce.number()",
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
    zodCode: "z.coerce.number()",
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
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
    zodCode: "z.coerce.number()",
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
    zodCode: "z.coerce.number()",
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
    zodCode: "z.coerce.number()",
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
    zodCode: "z.coerce.number()",
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
    zodCode: "z.coerce.number()",
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
    zodCode: "z.coerce.string()",
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
    zodCode: "z.coerce.string()",
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
    zodCode: "z.coerce.string()",
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
    zodCode: "z.coerce.string()",
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
    zodCode: "z.coerce.string()",
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
    zodCode: "z.coerce.boolean()",
  },
  date: {
    jsType: "string",
    sqlType: "date",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input-date.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: date()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
    zodCode: "z.coerce.date()",
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
    zodCode: "z.coerce.date()",
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
    zodCode: "z.coerce.string()",
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
    zodCode: "z.coerce.string()",
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
    zodCode: "z.coerce.date()",
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
    zodCode: "z.coerce.string()",
  },
  references: {
    jsType: "string",
    sqlType: "varchar",
    formTemplate:
      "scaffold-processor/components/table/create-references-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: ${opts.fkStrategyTemplate}.references(() => ${opts.referencesTable}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      if (opts.isAutoIncrement)
        return formDataUtils.referencesAutoIncrement(
          opts.keyName,
          opts.columnName
        );
      return formDataUtils.references(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
    zodCode: "z.coerce.string()",
  },
  references_select: {
    jsType: "string",
    sqlType: "varchar",
    formTemplate:
      "scaffold-processor/components/table/create-references-select.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-select.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: ${opts.fkStrategyTemplate}.references(() => ${opts.referencesTable}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      if (opts.isAutoIncrement)
        return formDataUtils.referencesAutoIncrement(
          opts.keyName,
          opts.columnName
        );
      return formDataUtils.references(opts.keyName, opts.columnName);
    },
    formComponents: ["select"],
    zodCode: "z.coerce.string()",
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
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
    formComponents: ["tiptap-editor"],
    zodCode: "z.coerce.string()",
  },
};

export const mysqlDialectStrategy: DbDialectStrategy = {
  pkDataType: "varchar",
  fkAutoIncrementDataType: "bigint",
  createdAtTemplate: `createdAt: timestamp().notNull().defaultNow(),`,
  updatedAtTemplate: `updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),`,
  pkStrategyTemplates: {
    uuidv7: `id: varchar({ length: 255 }).primaryKey().$defaultFn(() => uuidv7()),`,
    uuidv4: `id: varchar({ length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),`,
    cuid2:
      "id: varchar({ length: 255 }).primaryKey().$defaultFn(() => createId()),",
    nanoid: `id: varchar({ length: 255 }).primaryKey().$defaultFn(() => nanoid()),`,
    auto_increment: `id: bigint({ mode: "number" }).autoincrement().primaryKey(),`,
  },
  pkStrategyDataTypes: {
    cuid2: "varchar",
    uuidv7: "varchar",
    uuidv4: "varchar",
    nanoid: "varchar",
    auto_increment: "bigint",
  },
  fkStrategyTemplates: {
    cuid2: "varchar({ length: 255 })",
    uuidv7: "varchar({ length: 255 })",
    uuidv4: "varchar({ length: 255 })",
    nanoid: "varchar({ length: 255 })",
    auto_increment: `bigint({ mode: "number"})`,
  },
  pkStrategyJsType: {
    cuid2: "string",
    uuidv7: "string",
    uuidv4: "string",
    nanoid: "string",
    auto_increment: "number",
  },
  drizzleDbCorePackage: "drizzle-orm/mysql-core",
  tableConstructor: "mysqlTable",
  dialect: "mysql",
  dataTypeStrategyMap: mysqlDataTypeStrategies,
  timestampImport: "timestamp",
};
