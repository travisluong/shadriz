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

export interface GetColumnDefObjsOpts {
  columnName: string;
  table: string;
}

export interface ShadrizScaffoldUtils {
  addCodeToSchema: (opts: ScaffoldOpts) => void;
  getKeyValueStrForSchema: (column: string) => string;
  addListView: (opts: ScaffoldOpts) => void;
  addDetailView: (opts: ScaffoldOpts) => void;
  addEditView: (opts: ScaffoldOpts) => void;
  addNewView: (opts: ScaffoldOpts) => void;
  addDeleteView: (opts: ScaffoldOpts) => void;
  addCreateAction: (opts: ScaffoldOpts) => void;
  addUpdateAction: (opts: ScaffoldOpts) => void;
  addDeleteAction: (opts: ScaffoldOpts) => void;
  addColumnDef: (opts: ScaffoldOpts) => void;
  getColumnDefObjs: (opts: GetColumnDefObjsOpts) => string;
  addCreateForm: (opts: ScaffoldOpts) => void;
  getFormControlsHtml: (opts: ScaffoldOpts) => string;
  getUpdateFormControlsHtml: (opts: ScaffoldOpts) => string;
  addUpdateForm: (opts: ScaffoldOpts) => void;
  addDeleteForm: (opts: ScaffoldOpts) => void;
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
