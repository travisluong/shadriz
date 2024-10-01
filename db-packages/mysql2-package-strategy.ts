import { log } from "../lib/log";
import { DbDialect, DbPackageStrategy, ShadrizConfig } from "../lib/types";
import { appendDbUrl, renderTemplate } from "../lib/utils";

export class Mysql2PackageStrategy implements DbPackageStrategy {
  opts: ShadrizConfig;
  shadcnComponents: string[] = [];
  dialect: DbDialect = "mysql";
  dependencies = ["mysql2"];
  devDependencies = [];

  constructor(opts: ShadrizConfig) {
    this.opts = opts;
  }

  async init() {
    log.init("initializing mysql2 package...");
    await this.render();
  }

  async render(): Promise<void> {
    this.copyMigrateScript();
    this.appendDbUrl();
    this.copyDbInstance();
    this.copyDbInstanceForScripts();
    this.copyCreateUserScript();
  }

  copyMigrateScript(): void {
    renderTemplate({
      inputPath: "db-packages/scripts/migrate.ts.hbs",
      outputPath: "scripts/migrate.ts",
      data: {
        migratorImport: `import { migrate } from "drizzle-orm/mysql2/migrator";`,
      },
    });
  }

  appendDbUrl(): void {
    appendDbUrl("mysql://user:password@host:port/db");
  }

  copyDbInstance(): void {
    renderTemplate({
      inputPath: "db-packages/lib/db.ts.mysql2.hbs",
      outputPath: "lib/db.ts",
    });
  }

  copyDbInstanceForScripts(): void {
    renderTemplate({
      inputPath: "db-packages/scripts/sdb.ts.mysql2.hbs",
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
    log.checklist("mysql2 checklist");
    log.task("update DB_URL in .env.local");
    log.cmdtask("npx drizzle-kit generate");
    log.cmdtask("npx drizzle-kit migrate");
  }
}
