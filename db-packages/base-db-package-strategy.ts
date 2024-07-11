import { DbDialect } from "../lib/types";

export abstract class BaseDbPackageStrategy {
  public abstract dialect: DbDialect;
  public abstract init(): void;
  public abstract copyCreateUserScript();
  protected abstract installDependencies(): void;
  protected abstract copyMigrateScript(): void;
  protected abstract appendDbUrl(): void;
  protected abstract copyDbInstance(): void;
  protected abstract copyDbInstanceForScripts(): void;
}
