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
  private: boolean;
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
  drizzleDbCorePackage: string;
  tableConstructor: string;
  dataTypeStrategyMap: DataTypeStrategyMap;
  dialectArgsMap: { [key: string]: string };
  init(): void;
  addAuthSchema(): void;
  copyCreateUserScript(): void;
  copyDrizzleConfig(): void;
  copySchema(): void;
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
}

export interface NewProjectProcessorOpts {
  pnpm: boolean;
}

export interface DbPackageStrategyOpts {
  pnpm: boolean;
}

export type AuthProvider = "github" | "google" | "credentials";

export type SessionStrategy = "jwt" | "database";

export type DbPackage = "pg" | "mysql2" | "better-sqlite3";
