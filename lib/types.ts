export type DbDialect = "postgresql" | "mysql" | "sqlite";

export interface PackageStrategy {
  dialect: DbDialect;
  init: () => void;
  installDependencies: () => void;
  copyMigrateScript: () => void;
  appendDbUrl: () => void;
  copyDbInstance: () => void;
  copyDBInstanceForScripts: () => void;
  copyCreateUserScript: () => void;
}

export interface DialectStrategy {
  dialect: DbDialect;
  init: () => void;
  copyDrizzleConfig: () => void;
  copySchema: () => void;
  scaffold: (opts: ScaffoldOpts) => void;
  appendAuthSchema: () => void;
}

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

export interface DataTypeStrategy {
  jsType: string;
  formTemplate: string;
  updateFormTemplate: string;
  getKeyValueStrForSchema: (opts: DataTypeStrategyOpts) => string;
}
