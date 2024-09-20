import { caseFactory } from "../lib/case-utils";
import { formDataUtils } from "../lib/form-data-utils";
import {
  DataTypeStrategyMap,
  DataTypeStrategyOpts,
  DbDialect,
  DbDialectStrategy,
  PkStrategy,
} from "../lib/types";

const mysqlDataTypeStrategies: DataTypeStrategyMap = {
  int: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: int(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
  },
  tinyint: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: tinyint(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
  },
  smallint: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: smallint(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
  },
  mediumint: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: mediumint(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
  },
  bigint: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: bigint(\"${opts.columnName}\", { mode: "number" })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
  },
  real: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: real(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.keyName, opts.columnName);
    },
  },
  decimal: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: decimal(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
  },
  double: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: double(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.keyName, opts.columnName);
    },
  },
  float: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: float(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.float(opts.keyName, opts.columnName);
    },
  },
  serial: {
    jsType: "number",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: serial(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.integer(opts.keyName, opts.columnName);
    },
  },
  binary: {
    jsType: "string",
    formTemplate: "",
    updateFormTemplate: "",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
  },
  varbinary: {
    jsType: "string",
    formTemplate: "",
    updateFormTemplate: "",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
  },
  char: {
    jsType: "string",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: char(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
  },
  varchar: {
    jsType: "string",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: varchar(\"${opts.columnName}\", { length: 255 })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
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
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
  },
  boolean: {
    jsType: "boolean",
    formTemplate: "scaffold-processor/components/table/create-checkbox.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-checkbox.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: boolean(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.boolean(opts.keyName, opts.columnName);
    },
  },
  date: {
    jsType: "string",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: date(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.keyName, opts.columnName);
    },
  },
  datetime: {
    jsType: "string",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input-timestamp.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: datetime(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.keyName, opts.columnName);
    },
  },
  time: {
    jsType: "string",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: time(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.string(opts.keyName, opts.columnName);
    },
  },
  year: {
    jsType: "string",
    formTemplate: "",
    updateFormTemplate: "",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      throw new Error("Function not implemented.");
    },
  },
  timestamp: {
    jsType: "string",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input-timestamp.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: timestamp(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.date(opts.keyName, opts.columnName);
    },
  },
  json: {
    jsType: "object",
    formTemplate: "scaffold-processor/components/table/create-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-input-json.tsx.hbs",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: json(\"${opts.columnName}\")`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.json(opts.keyName, opts.columnName);
    },
  },
  references: {
    jsType: "string",
    formTemplate:
      "scaffold-processor/components/table/create-references-input.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-references-input.tsx.hbs",
    dataTypeOverride: "varchar",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.keyName}: text(\"${opts.columnName}\").references(() => ${opts.referencesTable}.id)`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.references(opts.keyName, opts.columnName);
    },
  },
  file: {
    jsType: "string",
    formTemplate: "scaffold-processor/components/table/create-file.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-file.tsx.hbs",
    dataTypeOverride: "varchar",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: varchar(\"${opts.columnName}\", { length: 255 })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.file(opts.keyName, opts.columnName);
    },
  },
  image: {
    jsType: "string",
    formTemplate: "scaffold-processor/components/table/create-image.tsx.hbs",
    updateFormTemplate:
      "scaffold-processor/components/table/update-image.tsx.hbs",
    dataTypeOverride: "varchar",
    getKeyValueStrForSchema: function (opts: DataTypeStrategyOpts): string {
      return `${opts.columnName}: varchar(\"${opts.columnName}\", { length: 255 })`;
    },
    getKeyValStrForFormData: function (opts: DataTypeStrategyOpts): string {
      return formDataUtils.image(opts.keyName, opts.columnName);
    },
  },
};

export class MysqlDialectStrategy implements DbDialectStrategy {
  pkDataType: string = "varchar";
  createdAtTemplate: string = `createdAt: timestamp("created_at").defaultNow(),`;
  updatedAtTemplate: string = `updatedAt: timestamp("updated_at").defaultNow(),`;
  pkStrategyTemplates: Record<PkStrategy, string> = {
    uuidv7: `id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => uuidv7()),`,
    uuidv4: `id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),`,
    cuid2:
      'id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => createId()),',
    nanoid: `id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => nanoid()),`,
  };
  drizzleDbCorePackage: string = "drizzle-orm/mysql-core";
  tableConstructor: string = "mysqlTable";
  dialect: DbDialect = "mysql";
  dataTypeStrategyMap: DataTypeStrategyMap = mysqlDataTypeStrategies;
  timestampImport = "timestamp";
}
