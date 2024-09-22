import { log } from "../lib/log";
import { DbDialect, DbPackageStrategy, ShadrizConfig } from "../lib/types";
import { appendDbUrl, installDependencies, renderTemplate } from "../lib/utils";

export class Mysql2PackageStrategy implements DbPackageStrategy {
  constructor(opts: ShadrizConfig) {
    this.opts = opts;
  }

  opts: ShadrizConfig;

  dialect: DbDialect = "mysql";

  dependencies = ["mysql2"];

  devDependencies = [];

  async init() {
    await this.install();
    await this.render();
  }

  async install(): Promise<void> {
    if (!this.opts.install) {
      return;
    }

    await installDependencies({
      dependencies: this.dependencies,
      packageManager: this.opts.packageManager,
      latest: this.opts.latest,
    });
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
    log.log("\nconfigure database:");
    log.dash("update DB_URL in .env.local");
    log.log("\nrun migrations:");
    log.cmd("npx drizzle-kit generate");
    log.cmd("npx drizzle-kit migrate");
  }
}
