export interface ShadrizConfig {
  version: string;
  packageManager: PackageManager;
  latest: boolean;
  dbDialect: DbDialect;
  dbPackage: DbPackage;
  pkStrategy: PkStrategy;
  timestampsEnabled: boolean;
  authSolution: AuthSolution;
  authProviders: AuthProvider[];
  adminEnabled: boolean;
  stripeEnabled: boolean;
  sessionStrategy: SessionStrategy;
  darkModeEnabled: boolean;
}

export type AuthSolution = "authjs" | "shadriz" | "none";

export type PackageManager = "npm" | "pnpm";

export interface ShadrizProcessorOpts {
  packageManager: PackageManager;
  install: boolean;
  latest: boolean;
}

export interface DbDialectProcessorOpts extends ShadrizProcessorOpts {
  dbDialect: DbDialect;
}

export interface AdminProcessorOpts extends ShadrizProcessorOpts {
  dbDialect: DbDialect;
  dbDialectStrategy: DbDialectStrategy;
  pkStrategy: PkStrategy;
  dbPackage: DbPackage;
}

export interface PkStrategyProcessorOpts extends ShadrizProcessorOpts {
  pkStrategy: PkStrategy;
}

export interface NewProjectProcessorOpts extends ShadrizProcessorOpts {
  darkMode: boolean;
  authEnabled: boolean;
  stripeEnabled: boolean;
}

export interface DbPackageStrategyOpts extends ShadrizProcessorOpts {}

export interface DarkModeProcessorOpts extends ShadrizProcessorOpts {}

export type PkStrategy = "cuid2" | "uuidv7" | "uuidv4" | "uuid" | "nanoid";

export interface StripeProcessorOpts extends ShadrizProcessorOpts {
  dbDialectStrategy: DbDialectStrategy;
  pkStrategy: PkStrategy;
  dbDialect: DbDialect;
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
  dbDialect: DbDialect;
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
  dataTypeOverride?: string;
  getKeyValueStrForSchema(opts: DataTypeStrategyOpts): string;
  getKeyValStrForFormData(opts: DataTypeStrategyOpts): string;
}

export interface DbDialectStrategy {
  dialect: DbDialect;
  drizzleDbCorePackage: string;
  tableConstructor: string;
  dataTypeStrategyMap: DataTypeStrategyMap;
  dialectConstraintsMap: { [key: string]: string };
  pkStrategyTemplates: Record<PkStrategy, string>;
  createdAtTemplate: string;
  updatedAtTemplate: string;
  pkDataType: string;
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
  printCompletionMessage(): void;
}

export type AuthProvider =
  | "github"
  | "google"
  | "credentials"
  | "postmark"
  | "nodemailer";

export type SessionStrategy = "jwt" | "database";

export type DbPackage = "pg" | "mysql2" | "better-sqlite3";
