import { ShadrizDBStrategy } from "../lib/types";
import { appendDbUrl, renderTemplate, runCommand } from "../lib/utils";

export const betterSqlite3Strategy: ShadrizDBStrategy = {
  installDependencies: async function () {
    await runCommand("npm i better-sqlite3", []);
  },
  copyDrizzleConfig: function (): void {
    renderTemplate({
      inputPath: "drizzle.config.ts.hbs",
      outputPath: "drizzle.config.ts",
      data: { dialect: "sqlite" },
    });
  },
  copyMigrateScript: function (): void {
    renderTemplate({
      inputPath: "scripts/migrate.ts.better-sqlite3.hbs",
      outputPath: "scripts/migrate.ts",
      data: {},
    });
  },
  copySchema: function (): void {
    renderTemplate({
      inputPath: "lib/schema.ts.better-sqlite3.hbs",
      outputPath: "lib/schema.ts",
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
  scaffold: function ({
    table,
    columns,
  }: {
    table: string;
    columns: string[];
  }): void {
    throw new Error("Function not implemented.");
  },
};
