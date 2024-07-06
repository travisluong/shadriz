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
  getKeyValueStrForSchema: ({
    dataType,
    columnName,
  }: {
    dataType: string;
    columnName: string;
  }) => string;
  addListView: (opts: ScaffoldOpts) => void;
  addDetailView: (opts: ScaffoldOpts) => void;
  addEditView: (opts: ScaffoldOpts) => void;
  addNewView: (opts: ScaffoldOpts) => void;
  addCreateAction: (opts: ScaffoldOpts) => void;
  addUpdateAction: (opts: ScaffoldOpts) => void;
  addDeleteAction: (opts: ScaffoldOpts) => void;
  addColumnDef: (opts: ScaffoldOpts) => void;
  getKeyValueStrForType({
    dataType,
    columnName,
  }: {
    dataType: string;
    columnName: string;
  });
  getJsTypeByDataType: (dataType: string) => string;
  getColumnDefObjs: (columnName: string) => string;
}
