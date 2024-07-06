import { ShadrizDBStrategy } from "../lib/types";
import {
  appendDbUrl,
  appendToFile,
  compileTemplate,
  renderTemplate,
  runCommand,
} from "../lib/utils";

export const pgStrategy: ShadrizDBStrategy = {
  installDependencies: async function () {
    await runCommand("npm i pg", []);
    await runCommand("npm i -D @types/pg", []);
  },
  copyDrizzleConfig: function (): void {
    renderTemplate({
      inputPath: "drizzle.config.ts.hbs",
      outputPath: "drizzle.config.ts",
      data: { dialect: "postgresql" },
    });
  },
  copyMigrateScript: function (): void {
    renderTemplate({
      inputPath: "scripts/migrate.ts.pg.hbs",
      outputPath: "scripts/migrate.ts",
      data: {},
    });
  },
  copySchema: function (): void {
    renderTemplate({
      inputPath: "lib/schema.ts.pg.hbs",
      outputPath: "lib/schema.ts",
      data: {},
    });
  },
  appendDbUrl: function (): void {
    appendDbUrl("postgres://user:password@host:port/db");
  },
  copyDbInstance: function (): void {
    renderTemplate({
      inputPath: "lib/db.ts.pg.hbs",
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
    // compile columns
    let columnsCode = "";
    for (const [index, column] of columns.entries()) {
      const [columnName, dataType] = column.split(":");
      switch (dataType) {
        case "varchar":
          columnsCode += `    ${columnName}: varchar(\"${columnName}\", { length: 255 }),`;
          break;
        case "text":
          columnsCode += `    ${columnName}: text(\"${columnName}\"),`;
          break;
        default:
          break;
      }
      if (index !== columns.length - 1) {
        columnsCode += "\n";
      }
    }
    // compile str
    const str = compileTemplate({
      inputPath: "lib/schema.ts.pg.table.hbs",
      data: { table, columns: columnsCode },
    });

    console.log(str);

    appendToFile("lib/schema.ts", str);
  },
};
