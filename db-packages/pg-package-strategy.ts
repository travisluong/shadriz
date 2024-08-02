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

    await installDevDependencies({
      devDependencies: this.devDependencies,
      pnpm: this.opts.pnpm,
      latest: this.opts.latest,
    });
  }

  render(): Promise<void> {
    throw new Error("Method not implemented.");
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
}
