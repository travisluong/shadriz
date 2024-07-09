export interface ShadrizDBStrategy {
  installDependencies: () => void;
  copyDrizzleConfig: () => void;
  copyMigrateScript: () => void;
  copySchema: () => void;
  appendDbUrl: () => void;
  copyDbInstance: () => void;
  scaffold: (opts: ScaffoldOpts) => void;
}

export interface ScaffoldOpts {
  table: string;
  columns: string[];
}

export interface DataTypeStrategyMap {
  [key: string]: DataTypeStrategy;
}

export interface ScaffoldProcessorOpts extends ScaffoldOpts {
  schemaTemplatePath: string;
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
