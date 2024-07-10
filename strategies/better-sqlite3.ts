import { PackageStrategy } from "../lib/types";
import { appendDbUrl, renderTemplate, runCommand } from "../lib/utils";

export const betterSqlite3Strategy: PackageStrategy = {
  dialect: "sqlite",
  init: async function () {
    await betterSqlite3Strategy.installDependencies();
    betterSqlite3Strategy.copyMigrateScript();
    betterSqlite3Strategy.appendDbUrl();
    betterSqlite3Strategy.copyDbInstance();
  },
  installDependencies: async function () {
    await runCommand("npm i better-sqlite3");
  },
  copyMigrateScript: function (): void {
    renderTemplate({
      inputPath: "scripts/migrate.ts.better-sqlite3.hbs",
      outputPath: "scripts/migrate.ts",
      data: {},
    });
  },
  appendDbUrl: function (): void {
    appendDbUrl("sqlite.db");
  },
  copyDbInstance: function (): void {
    renderTemplate({
      inputPath: "lib/db.ts.better-sqlite3.hbs",
      outputPath: "lib/db.ts",
      data: {},
    });
  },
  copyDBInstanceForScripts: function (): void {
    renderTemplate({
      inputPath: "scripts/dbc.ts.better-sqlite3.hbs",
      outputPath: "scripts/dbc.ts",
      data: {},
    });
  },
};
