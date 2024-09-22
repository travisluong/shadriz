import { log } from "../lib/log";
import { DbDialect, DbPackageStrategy, ShadrizConfig } from "../lib/types";
import {
  appendDbUrl,
  installDependencies,
  installDevDependencies,
  renderTemplate,
} from "../lib/utils";

export class PgPackageStrategy implements DbPackageStrategy {
  constructor(opts: ShadrizConfig) {
    this.opts = opts;
  }

  opts: ShadrizConfig;

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
    log.log("\nconfigure database:");
    log.dash("update DB_URL in .env.local");
    log.log("\nrun migrations:");
    log.cmd("npx drizzle-kit generate");
    log.cmd("npx drizzle-kit migrate");
  }
}
