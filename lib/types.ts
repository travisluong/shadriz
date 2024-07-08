export interface ShadrizDBStrategy {
  installDependencies: () => void;
  copyDrizzleConfig: () => void;
  copyMigrateScript: () => void;
  copySchema: () => void;
  appendDbUrl: () => void;
  copyDbInstance: () => void;
  scaffold: ({ table, columns }: { table: string; columns: string[] }) => void;
}

export interface ScaffoldOpts {
  table: string;
  columns: string[];
}

export interface ShadrizScaffoldUtils {
  addCodeToSchema: (opts: ScaffoldOpts) => void;
  getKeyValueStrForSchema: (column: string) => string;
  addListView: (opts: ScaffoldOpts) => void;
  addDetailView: (opts: ScaffoldOpts) => void;
  addEditView: (opts: ScaffoldOpts) => void;
  addNewView: (opts: ScaffoldOpts) => void;
  addCreateAction: (opts: ScaffoldOpts) => void;
  addUpdateAction: (opts: ScaffoldOpts) => void;
  addDeleteAction: (opts: ScaffoldOpts) => void;
  addColumnDef: (opts: ScaffoldOpts) => void;
  getColumnDefObjs: ({
    columnName,
    table,
  }: {
    columnName: string;
    table: string;
  }) => string;
  addCreateForm: (opts: ScaffoldOpts) => void;
  getFormControlsHtml: (opts: ScaffoldOpts) => string;
  getUpdateFormControlsHtml: (opts: ScaffoldOpts) => string;
  addUpdateForm: (opts: ScaffoldOpts) => void;
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
