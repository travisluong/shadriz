export interface ShadrizConfig {
  version: string;
  packageManager: PackageManager;
  latest: boolean;
  dbDialect: DbDialect;
  dbPackage: DbPackage;
  pkStrategy: PkStrategy;
  authEnabled: boolean;
  authSolution: AuthSolution;
  authProviders: AuthProvider[];
  adminEnabled: boolean;
  stripeEnabled: boolean;
  sessionStrategy: SessionStrategy;
  darkModeEnabled: boolean;
  install: boolean;
}

export type AuthSolution = "authjs" | "none";

export type PackageManager = "npm" | "pnpm";

export type PkStrategy = "cuid2" | "uuidv7" | "uuidv4" | "nanoid";

export interface ShadrizProcessor {
  opts: ShadrizConfig;
  dependencies: string[];
  devDependencies: string[];
  shadcnComponents: string[];
  dbDialectStrategy?: DbDialectStrategy;
  init(): Promise<void>;
  install(): Promise<void>;
  render(): Promise<void>;
  printCompletionMessage: () => void;
}

export type DbDialect = "postgresql" | "mysql" | "sqlite";

export interface DataTypeStrategyMap {
  [key: string]: DataTypeStrategy;
}

export type AuthorizationLevel = "admin" | "private" | "public";

export interface ScaffoldProcessorOpts extends ShadrizConfig {
  table: string;
  columns: string[];
  authorizationLevel: AuthorizationLevel;
}

export interface DataTypeStrategyOpts {
  keyName: string;
  columnName: string;
  referencesTable?: string;
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
  pkStrategyTemplates: Record<PkStrategy, string>;
  createdAtTemplate: string;
  updatedAtTemplate: string;
  pkDataType: string;
  timestampImport?: string;
}

export interface DbPackageStrategy extends ShadrizProcessor {
  opts: ShadrizConfig;
  dialect: DbDialect;
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
