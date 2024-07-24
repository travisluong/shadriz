import {
  DbDialect,
  DbPackageStrategy,
  DbPackageStrategyOpts,
} from "../lib/types";
import { appendDbUrl, renderTemplate, spawnCommand } from "../lib/utils";

export class PgPackageStrategy implements DbPackageStrategy {
  opts: DbPackageStrategyOpts = { pnpm: false };

  dialect: DbDialect = "postgresql";

  constructor(opts?: DbPackageStrategyOpts) {
    this.opts = {
      ...this.opts,
      ...opts,
    };
  }

  async init() {
    await this.installDependencies();
    this.copyMigrateScript();
    this.appendDbUrl();
    this.copyDbInstance();
    this.copyDbInstanceForScripts();
  }

  async installDependencies() {
    if (this.opts.pnpm) {
      await spawnCommand("pnpm add pg");
      await spawnCommand("pnpm add -D @types/pg");
      return;
    }
    await spawnCommand("npm install pg");
    await spawnCommand("npm install -D @types/pg");
  }

  copyMigrateScript(): void {
    renderTemplate({
      inputPath: "scripts/migrate.ts.pg.hbs",
      outputPath: "scripts/migrate.ts",
    });
  }

  appendDbUrl(): void {
    appendDbUrl("postgres://user:password@host:port/db");
  }

  copyDbInstance(): void {
    renderTemplate({
      inputPath: "lib/db.ts.pg.hbs",
      outputPath: "lib/db.ts",
    });
  }

  copyDbInstanceForScripts(): void {
    renderTemplate({
      inputPath: "scripts/sdb.ts.pg.hbs",
      outputPath: "scripts/sdb.ts",
    });
  }

  copyCreateUserScript() {
    renderTemplate({
      inputPath: "scripts/create-user.ts.pg.hbs",
      outputPath: "scripts/create-user.ts",
    });
  }

  setPnpm(val: boolean): void {
    this.opts.pnpm = val;
  }
}
