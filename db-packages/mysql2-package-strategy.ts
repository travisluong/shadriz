import {
  DbDialect,
  DbPackageStrategy,
  DbPackageStrategyOpts,
} from "../lib/types";
import { appendDbUrl, renderTemplate, spawnCommand } from "../lib/utils";

export class Mysql2PackageStrategy implements DbPackageStrategy {
  opts: DbPackageStrategyOpts;

  dialect: DbDialect = "mysql";

  constructor(opts: DbPackageStrategyOpts) {
    this.opts = opts;
  }

  async init() {
    await this.installDependencies();
    this.copyMigrateScript();
    this.appendDbUrl();
    this.copyDbInstance();
    this.copyDbInstanceForScripts();
  }

  async installDependencies() {
    if (!this.opts.install) {
      return;
    }
    if (this.opts.pnpm) {
      await spawnCommand("pnpm add mysql2");
      return;
    }
    await spawnCommand("npm install mysql2");
  }

  copyMigrateScript(): void {
    renderTemplate({
      inputPath: "scripts/migrate.ts.mysql2.hbs",
      outputPath: "scripts/migrate.ts",
    });
  }

  appendDbUrl(): void {
    appendDbUrl("mysql://user:password@host:port/db");
  }

  copyDbInstance(): void {
    renderTemplate({
      inputPath: "lib/db.ts.mysql2.hbs",
      outputPath: "lib/db.ts",
    });
  }

  copyDbInstanceForScripts(): void {
    renderTemplate({
      inputPath: "scripts/sdb.ts.mysql2.hbs",
      outputPath: "scripts/sdb.ts",
    });
  }

  copyCreateUserScript() {
    renderTemplate({
      inputPath: "scripts/create-user.ts.mysql2.hbs",
      outputPath: "scripts/create-user.ts",
    });
  }

  setPnpm(val: boolean): void {
    this.opts.pnpm = val;
  }
}
