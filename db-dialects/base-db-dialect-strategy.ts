import { DbDialect, ScaffoldOpts } from "../lib/types";

export abstract class BaseDbDialectStrategy {
  public abstract dialect: DbDialect;
  public abstract init(): void;
  public abstract scaffold(opts: ScaffoldOpts): void;
  public abstract appendAuthSchema(): void;
  public abstract copyCreateUserScript(): void;
  protected abstract copyDrizzleConfig(): void;
  protected abstract copySchema(): void;
}
