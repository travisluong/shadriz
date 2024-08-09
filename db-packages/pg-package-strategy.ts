import {
  DbDialect,
  DbPackageStrategy,
  DbPackageStrategyOpts,
} from "../lib/types";
import {
  appendDbUrl,
  installDependencies,
  installDevDependencies,
  renderTemplate,
} from "../lib/utils";

export class PgPackageStrategy implements DbPackageStrategy {
  constructor(opts: DbPackageStrategyOpts) {
    this.opts = opts;
  }

  opts: DbPackageStrategyOpts;

  dialect: DbDialect = "postgresql";

  dependencies = ["pg"];

  devDependencies = ["@types/pg"];

  async init() {
    await this.install();
    this.copyMigrateScript();
    this.appendDbUrl();
    this.copyDbInstance();
    this.copyDbInstanceForScripts();
    this.copyCreateUserScript();
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

    await installDevDependencies({
      devDependencies: this.devDependencies,
      packageManager: this.opts.packageManager,
      latest: this.opts.latest,
    });
  }

  render(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  copyMigrateScript(): void {
    renderTemplate({
      inputPath: "db-packages/scripts/migrate.ts.pg.hbs",
      outputPath: "scripts/migrate.ts",
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
      inputPath: "db-packages/scripts/create-user.ts.pg.hbs",
      outputPath: "scripts/create-user.ts",
    });
  }
}
