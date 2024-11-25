import { formDataUtils } from "../lib/form-data-utils";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  DbDialectStrategy,
} from "../lib/types";

const postgresqlDataTypeStrategies: DataTypeStrategyMap = {
  integer: {
    jsType: "number",
    sqlType: "integer",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: integer()`;
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
  smallserial: {
    jsType: "number",
    sqlType: "smallserial",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: smallserial()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
    zodCode: "z.coerce.number()",
  },
  bigserial: {
    jsType: "number",
    sqlType: "bigserial",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: bigserial({ mode: "number" })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
    zodCode: "z.coerce.number()",
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
  char: {
    jsType: "string",
    sqlType: "char",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: char({ length: 255 })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
    zodCode: "z.coerce.string()",
  },
  numeric: {
    jsType: "number",
    sqlType: "numeric",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: numeric()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
    zodCode: "z.coerce.string()",
  },
  decimal: {
    jsType: "number",
    sqlType: "decimal",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: decimal()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
    zodCode: "z.coerce.string()",
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
  doublePrecision: {
    jsType: "number",
    sqlType: "doublePrecision",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: doublePrecision()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
    zodCode: "z.coerce.number()",
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
  jsonb: {
    jsType: "object",
    sqlType: "jsonb",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input-json.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: jsonb()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.json(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
    zodCode: "z.coerce.string()",
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
  date: {
    jsType: "string",
    sqlType: "date",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input-date.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: date({ mode: "date" })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
    zodCode: "z.coerce.date()",
  },
  uuid: {
    jsType: "string",
    sqlType: "uuid",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: uuid()`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
    formComponents: ["input"],
    zodCode: "z.string().uuid()",
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
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.keyName, opts.columnName);
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
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.keyName, opts.columnName);
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

export const postgresqlDialectStrategy: DbDialectStrategy = {
  pkDataType: "text",
  fkAutoIncrementDataType: "bigint",
  createdAtTemplate: `createdAt: timestamp().notNull().defaultNow(),`,
  updatedAtTemplate: `updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),`,
  pkStrategyTemplates: {
    uuidv7: `id: uuid().primaryKey().$defaultFn(() => uuidv7()),`,
    uuidv4: `id: uuid().primaryKey().$defaultFn(() => crypto.randomUUID()),`,
    cuid2: `id: text().primaryKey().$defaultFn(() => createId()),`,
    nanoid: `id: text().primaryKey().$defaultFn(() => nanoid()),`,
    auto_increment: `id: bigserial({ mode: "number" }).primaryKey(),`,
  },
  pkStrategyDataTypes: {
    cuid2: "text",
    uuidv7: "uuid",
    uuidv4: "uuid",
    nanoid: "text",
    auto_increment: "bigserial",
  },
  fkStrategyTemplates: {
    cuid2: "text()",
    uuidv7: "uuid()",
    uuidv4: "uuid()",
    nanoid: "text()",
    auto_increment: `bigint({ mode: "number" })`,
  },
  pkStrategyJsType: {
    cuid2: "string",
    uuidv7: "string",
    uuidv4: "string",
    nanoid: "string",
    auto_increment: "number",
  },
  drizzleDbCorePackage: "drizzle-orm/pg-core",
  tableConstructor: "pgTable",
  dataTypeStrategyMap: postgresqlDataTypeStrategies,
  dialect: "postgresql",
  timestampImport: "timestamp",
};
