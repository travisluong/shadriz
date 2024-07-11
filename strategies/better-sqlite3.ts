import { DbDialect, PackageStrategy } from "../lib/types";
import { appendDbUrl, renderTemplate, spawnCommand } from "../lib/utils";

export class BetterSqlite3Strategy implements PackageStrategy {
  dialect: DbDialect = "sqlite";

  async init() {
    await this.installDependencies();
    this.copyMigrateScript();
    this.appendDbUrl();
    this.copyDbInstance();
    this.copyDBInstanceForScripts();
  }

  async installDependencies() {
    await spawnCommand("npm i better-sqlite3");
  }

  copyMigrateScript(): void {
    renderTemplate({
      inputPath: "scripts/migrate.ts.better-sqlite3.hbs",
      outputPath: "scripts/migrate.ts",
    });
  }

  appendDbUrl(): void {
    appendDbUrl("sqlite.db");
  }

  copyDbInstance(): void {
    renderTemplate({
      inputPath: "lib/db.ts.better-sqlite3.hbs",
      outputPath: "lib/db.ts",
    });
  }

  copyDBInstanceForScripts(): void {
    renderTemplate({
      inputPath: "scripts/dbc.ts.better-sqlite3.hbs",
      outputPath: "scripts/dbc.ts",
    });
  }

  copyCreateUserScript() {
    renderTemplate({
      inputPath: "scripts/create-user.ts.better-sqlite3.hbs",
      outputPath: "scripts/create-user.ts",
    });
  }
}
