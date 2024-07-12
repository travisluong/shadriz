export type DbDialect = "postgresql" | "mysql" | "sqlite";

export interface ScaffoldOpts {
  table: string;
  columns: string[];
}

export interface DataTypeStrategyMap {
  [key: string]: DataTypeStrategy;
}

export interface ScaffoldProcessorOpts extends ScaffoldOpts {
  schemaTableTemplatePath: string;
  dataTypeStrategyMap: DataTypeStrategyMap;
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
  getKeyValueStrForSchema: (opts: DataTypeStrategyOpts) => string;
}

export interface DbDialectStrategy {
  dialect: DbDialect;
  init(): void;
  scaffold(opts: ScaffoldOpts): void;
  appendAuthSchema(): void;
  copyCreateUserScript(): void;
  copyDrizzleConfig(): void;
  copySchema(): void;
  printInitCompletionMessage(): void;
}

export interface DbPackageStrategy {
  dialect: DbDialect;
  init(): void;
  copyCreateUserScript();
  installDependencies(): void;
  copyMigrateScript(): void;
  appendDbUrl(): void;
  copyDbInstance(): void;
  copyDbInstanceForScripts(): void;
}
