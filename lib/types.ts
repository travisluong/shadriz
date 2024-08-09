export interface ShadrizConfigFile {
  version: string;
  latest: boolean;
  authEnabled: boolean;
  stripeEnabled: boolean;
  authProviders: AuthProvider[];
  sessionStrategy?: SessionStrategy;
  pkStrategy: PkStrategy;
  adminEnabled: boolean;
  dbPackage: DbPackage;
  dbDialect: DbDialect;
  darkModeEnabled: boolean;
  timestampsEnabled: boolean;
}

export type PackageManager = "npm" | "pnpm";

export interface ShadrizProcessorOpts {
  packageManager: PackageManager;
  install: boolean;
  latest: boolean;
}

export interface NewProjectProcessorOpts extends ShadrizProcessorOpts {
  darkMode: boolean;
  authEnabled: boolean;
  stripeEnabled: boolean;
}

export interface DbPackageStrategyOpts extends ShadrizProcessorOpts {}

export interface DarkModeProcessorOpts extends ShadrizProcessorOpts {}

export type PkStrategy = "uuidv7" | "uuidv4" | "uuid" | "auto-increment";

export interface StripeProcessorOpts extends ShadrizProcessorOpts {
  dbDialectStrategy: DbDialectStrategy;
  pkStrategy: PkStrategy;
}

export interface ShadrizProcessor {
  opts: ShadrizProcessorOpts;
  dependencies: string[];
  devDependencies: string[];
  shadcnComponents: string[];
  init(): Promise<void>;
  install(): Promise<void>;
  render(): Promise<void>;
}

export type DbDialect = "postgresql" | "mysql" | "sqlite";

export interface DataTypeStrategyMap {
  [key: string]: DataTypeStrategy;
}

export type AuthorizationLevel = "admin" | "private" | "public";

export interface ScaffoldProcessorOpts {
  table: string;
  columns: string[];
  dbDialectStrategy: DbDialectStrategy;
  authorizationLevel: AuthorizationLevel;
  pkStrategy: PkStrategy;
  timestampsEnabled: boolean;
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
  dialectConstraintsMap: { [key: string]: string };
  stripeSchemaTemplatePath: string;
  pkStrategyTemplates: Record<PkStrategy, string>;
  authSchemaTemplate: string;
  createdAtColumnStr: string;
  updatedAtColumnStr: string;
  pkStrategyColumnStr: Record<PkStrategy, string>;
  init(): void;
  copyDrizzleConfig(): void;
  copySchema(): void;
}

export interface DbPackageStrategy {
  opts: DbPackageStrategyOpts;
  dialect: DbDialect;
  dependencies: string[];
  devDependencies: string[];
  init(): Promise<void>;
  install(): Promise<void>;
  render(): Promise<void>;
  copyCreateUserScript(): void;
  copyMigrateScript(): void;
  appendDbUrl(): void;
  copyDbInstance(): void;
  copyDbInstanceForScripts(): void;
}

export type AuthProvider =
  | "github"
  | "google"
  | "credentials"
  | "postmark"
  | "nodemailer";

export type SessionStrategy = "jwt" | "database";

export type DbPackage = "pg" | "mysql2" | "better-sqlite3";
