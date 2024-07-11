import { DbDialect, ScaffoldOpts } from "../lib/types";
import { logCmd, logGhost } from "../lib/utils";

export abstract class BaseDbDialectStrategy {
  public abstract dialect: DbDialect;
  public abstract init(): void;
  public abstract scaffold(opts: ScaffoldOpts): void;
  public abstract appendAuthSchema(): void;
  public abstract copyCreateUserScript(): void;
  protected abstract copyDrizzleConfig(): void;
  protected abstract copySchema(): void;
  public printInitCompletionMessage() {
    logGhost("\n✅ db setup success: " + this.dialect);
    logGhost("\n👉 recommended next step:");
    switch (this.dialect) {
      case "mysql":
      case "postgresql":
        logGhost("- update DB_URL in .env.local");
        break;
      default:
        break;
    }
    logCmd("npx shadriz auth -h");
    logCmd("npx shadriz scaffold -h");
  }
}
