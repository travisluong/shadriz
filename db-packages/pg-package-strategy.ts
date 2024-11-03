import { log } from "../lib/log";
import { DbDialect, DbPackageStrategy, ShadjsConfig } from "../lib/types";
import { appendToEnvLocal, renderTemplate } from "../lib/utils";

export class PgPackageStrategy implements DbPackageStrategy {
  opts: ShadjsConfig;
  shadcnComponents: string[] = [];
  dialect: DbDialect = "postgresql";
  dependencies = ["pg"];
  devDependencies = ["@types/pg"];

  constructor(opts: ShadjsConfig) {
    this.opts = opts;
  }

  async init() {
    log.init("initializing pg package...");
    await this.render();
  }

  async render(): Promise<void> {
    this.copyMigrateScript();
    this.appendDbUrl();
    this.copyDbInstance();
    this.copyDbInstanceForScripts();
    this.copyCreateUserScript();

    renderTemplate({
      inputPath: "db-packages/lib/custom-types.ts.pg.hbs",
      outputPath: "lib/custom-types.ts",
    });
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
    appendToEnvLocal("DB_URL", "postgres://user:password@host:port/db");
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
    log.task("update DB_URL in .env.local");
    log.cmdtask("npm run generate");
    log.cmdtask("npm run migrate");
  }
}
