import { log } from "../lib/log";
import { DbDialect, DbPackageStrategy, ShadrizConfig } from "../lib/types";
import { appendDbUrl, renderTemplate } from "../lib/utils";

export class PgPackageStrategy implements DbPackageStrategy {
  opts: ShadrizConfig;
  shadcnComponents: string[] = [];
  dialect: DbDialect = "postgresql";
  dependencies = ["pg"];
  devDependencies = ["@types/pg"];

  constructor(opts: ShadrizConfig) {
    this.opts = opts;
  }

  async init() {
    log.init("initializing pg package...");
    this.copyMigrateScript();
    this.appendDbUrl();
    this.copyDbInstance();
    this.copyDbInstanceForScripts();
    this.copyCreateUserScript();
  }

  render(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  copyMigrateScript(): void {
    renderTemplate({
      inputPath: "db-packages/scripts/migrate.ts.hbs",
      outputPath: "scripts/migrate.ts",
      data: {
        migratorImport: `import { migrate } from "drizzle-orm/node-postgres/migrator";`,
      },
    });
  }

  appendDbUrl(): void {
    appendDbUrl("postgres://user:password@host:port/db");
  }

  copyDbInstance(): void {
    renderTemplate({
      inputPath: "db-packages/lib/db.ts.pg.hbs",
      outputPath: "lib/db.ts",
    });
  }

  copyDbInstanceForScripts(): void {
    renderTemplate({
      inputPath: "db-packages/scripts/sdb.ts.pg.hbs",
      outputPath: "scripts/sdb.ts",
    });
  }

  copyCreateUserScript() {
    renderTemplate({
      inputPath: "db-packages/scripts/create-user.ts.hbs",
      outputPath: "scripts/create-user.ts",
    });
  }

  printCompletionMessage(): void {
    log.checklist("pg checklist");
    log.task("update DB_URL in .env.local");
    log.cmdtask("npx drizzle-kit generate");
    log.cmdtask("npx drizzle-kit migrate");
  }
}
