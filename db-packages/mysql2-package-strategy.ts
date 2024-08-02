import {
  DbDialect,
  DbPackageStrategy,
  DbPackageStrategyOpts,
} from "../lib/types";
import { appendDbUrl, installDependencies, renderTemplate } from "../lib/utils";

export class Mysql2PackageStrategy implements DbPackageStrategy {
  constructor(opts: DbPackageStrategyOpts) {
    this.opts = opts;
  }

  opts: DbPackageStrategyOpts;

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
      pnpm: this.opts.pnpm,
      latest: this.opts.latest,
    });
  }

  async render(): Promise<void> {
    this.copyMigrateScript();
    this.appendDbUrl();
    this.copyDbInstance();
    this.copyDbInstanceForScripts();
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
}
