import { PackageStrategy } from "../lib/types";
import { appendDbUrl, renderTemplate, spawnCommand } from "../lib/utils";

export const mysql2Strategy: PackageStrategy = {
  installDependencies: async function () {
    await spawnCommand("npm i mysql2");
  },
  copyDrizzleConfig: function (): void {
    renderTemplate({
      inputPath: "drizzle.config.ts.hbs",
      outputPath: "drizzle.config.ts",
      data: { dialect: "mysql" },
    });
  },
  copyMigrateScript: function (): void {
    renderTemplate({
      inputPath: "scripts/migrate.ts.mysql2.hbs",
      outputPath: "scripts/migrate.ts",
      data: {},
    });
  },
  copySchema: function (): void {
    renderTemplate({
      inputPath: "lib/schema.ts.mysql2.hbs",
      outputPath: "lib/schema.ts",
      data: {},
    });
  },
  appendDbUrl: function (): void {
    appendDbUrl("mysql://user:password@host:port/db");
  },
  copyDbInstance: function (): void {
    renderTemplate({
      inputPath: "lib/db.ts.mysql2.hbs",
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
