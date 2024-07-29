import {
  DbDialect,
  DbPackageStrategy,
  DbPackageStrategyOpts,
} from "../lib/types";
import {
  appendDbUrl,
  appendToFile,
  renderTemplate,
  spawnCommand,
} from "../lib/utils";

export class BetterSqlite3PackageStrategy implements DbPackageStrategy {
  opts: DbPackageStrategyOpts;

  dialect: DbDialect = "sqlite";

  constructor(opts: DbPackageStrategyOpts) {
    this.opts = opts;
  }

  async init() {
    await this.installDependencies();
    this.copyMigrateScript();
    this.appendDbUrl();
    this.copyDbInstance();
    this.copyDbInstanceForScripts();
    this.appendSqliteToGitignore();
  }

  async installDependencies() {
    if (!this.opts.install) {
      return;
    }
    if (this.opts.pnpm) {
      await spawnCommand("pnpm add better-sqlite3");
      return;
    }
    await spawnCommand("npm install better-sqlite3");
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

  copyDbInstanceForScripts(): void {
    renderTemplate({
      inputPath: "scripts/sdb.ts.better-sqlite3.hbs",
      outputPath: "scripts/sdb.ts",
    });
  }

  copyCreateUserScript() {
    renderTemplate({
      inputPath: "scripts/create-user.ts.better-sqlite3.hbs",
      outputPath: "scripts/create-user.ts",
    });
  }

  appendSqliteToGitignore() {
    appendToFile(".gitignore", "\nsqlite.db");
  }

  setPnpm(val: boolean): void {
    this.opts.pnpm = val;
  }
}
