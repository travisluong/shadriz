export type DbDialect = "postgresql" | "mysql" | "sqlite";

export interface ScaffoldOpts {
  table: string;
  columns: string[];
}

export interface DataTypeStrategyMap {
  [key: string]: DataTypeStrategy;
}

export interface ScaffoldProcessorOpts extends ScaffoldOpts {
  dbDialectStrategy: DbDialectStrategy;
}

export interface GetColumnDefObjsOpts {
  columnName: string;
}

export interface GetKeyValueStrForSchemaOpts extends ScaffoldProcessorOpts {
  column: string;
}

export interface DataTypeStrategyOpts {
  columnName: string;
}

type JSType = "string" | "number" | "boolean" | "object";

export interface DataTypeStrategy {
  jsType: JSType;
  formTemplate: string;
  updateFormTemplate: string;
  getKeyValueStrForSchema(opts: DataTypeStrategyOpts): string;
  getKeyValStrForFormData(opts: DataTypeStrategyOpts): string;
}

export interface DbDialectStrategy {
  dialect: DbDialect;
  schemaTableTemplatePath: string;
  dataTypeStrategyMap: DataTypeStrategyMap;
  init(): void;
  appendAuthSchema(): void;
  copyCreateUserScript(): void;
  copyDrizzleConfig(): void;
  copySchema(): void;
  printInitCompletionMessage(): void;
}

export interface DbPackageStrategy {
  opts: DbPackageStrategyOpts;
  dialect: DbDialect;
  init(): void;
  copyCreateUserScript(): void;
  installDependencies(): void;
  copyMigrateScript(): void;
  appendDbUrl(): void;
  copyDbInstance(): void;
  copyDbInstanceForScripts(): void;
  setPnpm(val: boolean): void;
}

export interface NewProjectProcessorOpts {
  pnpm: boolean;
}

export interface DbPackageStrategyOpts {
  pnpm: boolean;
}
