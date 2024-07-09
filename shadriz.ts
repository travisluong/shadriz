import { Command } from "commander";
import chalk from "chalk";
import { DialectStrategy, PackageStrategy } from "./lib/types";
import { pgPackageStrategy } from "./strategies/pg";
import { mysql2Strategy } from "./strategies/mysql2";
import { betterSqlite3Strategy } from "./strategies/better-sqlite3";
import { copyTemplates, runCommand } from "./lib/utils";
import { postgresqlDialectStrategy } from "./dialects/postgresql";
import { sqliteDialectStrategy } from "./dialects/sqlite";

const packageStrategyMap: { [key: string]: PackageStrategy } = {
  pg: pgPackageStrategy,
  mysql2: mysql2Strategy,
  "better-sqlite3": betterSqlite3Strategy,
};

const dialectStrategyMap: { [key: string]: DialectStrategy } = {
  postgresql: postgresqlDialectStrategy,
  sqlite: sqliteDialectStrategy,
};

const program = new Command();

program
  .name("shadriz")
  .description(
    "shadriz - Full Stack Framework Next.js ShadCN/UI and Drizzle ORM"
  )
  .version("0.0.1");

program
  .command("new")
  .description("Create a new project with latest dependencies")
  .argument("<name>", "name of project")
  .action(async (name, options) => {
    try {
      await runCommand(
        `npx create-next-app ${name} --ts --eslint --tailwind --app --no-src-dir --no-import-alias`,
        []
      );
      await runCommand(
        `cd ${name} && npm i drizzle-orm --legacy-peer-deps && npm i -D drizzle-kit`,
        []
      );
      await runCommand(`cd ${name} && npm i dotenv uuidv7`, []);
      await runCommand(
        `cd ${name} && npm i @auth/drizzle-adapter next-auth@beta`,
        []
      );
      await runCommand(`cd ${name} && npx shadcn-ui@latest init -y -d`, []);
      await runCommand(
        `cd ${name} && npx shadcn-ui@latest add -y -o table`,
        []
      );
      await runCommand(`cd ${name} && npm install @tanstack/react-table`, []);
      await runCommand(
        `cd ${name} && npx shadcn-ui@latest add -y -o label`,
        []
      );
      await runCommand(
        `cd ${name} && npx shadcn-ui@latest add -y -o input`,
        []
      );
      await runCommand(
        `cd ${name} && npx shadcn-ui@latest add -y -o button`,
        []
      );
      await runCommand(
        `cd ${name} && npx shadcn-ui@latest add -y -o textarea`,
        []
      );
      await runCommand(`cd ${name} && npm install zod`, []);
      await runCommand(`cd ${name} && npm install drizzle-zod`, []);
      copyTemplates(name);
    } catch (error) {
      console.error("Error running command:", error);
    }
  });

program
  .command("db")
  .description("Generate Drizzle ORM configuration")
  .argument("<strategy>", "pg, mysql2, better-sqlite3")
  .action(async (strategy, options) => {
    if (!(strategy in packageStrategyMap)) {
      console.error(chalk.red(`${strategy} strategy invalid`));
      process.exit(1);
    }
    const packageStrategy = packageStrategyMap[strategy];
    const dialectStrategy = dialectStrategyMap[packageStrategy.dialect];
    await packageStrategy.init();
    dialectStrategy.init();
  });

program
  .command("auth")
  .description("Generate Auth.js configuration")
  .argument("<provider>", "provider: github, google")
  .action(async (provider, options) => {
    console.log(provider);
  });

program
  .command("scaffold")
  .description(
    "Generate CRUD ui, db schema, db migration, and server actions for a table"
  )
  .argument("<table>", "table: post, product, order, etc")
  .requiredOption("-c, --columns <columns...>", "specify columns")
  .requiredOption("-d, --dialect <dialect>", "postgresql, mysql, sqlite")
  .action(async (table, options) => {
    console.log(table);
    console.log(options);
    if (!(options.dialect in dialectStrategyMap)) {
      console.log(chalk.red(`${options.dialect} invalid strategy`));
      process.exit(1);
    }
    const strategy = dialectStrategyMap[options.dialect];
    strategy.scaffold({ table, columns: options.columns });
  });

program.parse();
