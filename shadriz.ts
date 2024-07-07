import { Command } from "commander";
import chalk from "chalk";
import { ShadrizDBStrategy } from "./lib/types";
import { pgStrategy } from "./strategies/pg";
import { mysql2Strategy } from "./strategies/mysql2";
import { betterSqlite3Strategy } from "./strategies/better-sqlite3";
import {
  copyConfig,
  copyDataTable,
  copyEnvLocal,
  copyTemplates,
  runCommand,
} from "./lib/utils";

const dbStrategies: { [key: string]: ShadrizDBStrategy } = {
  pg: pgStrategy,
  mysql2: mysql2Strategy,
  "better-sqlite3": betterSqlite3Strategy,
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
      copyTemplates(name);
    } catch (error) {
      console.error("Error running command:", error);
    }
  });

program
  .command("db")
  .description("Generate Drizzle ORM configuration")
  .argument("<strategy>", "sql strategy: pg, mysql, sqlite")
  .action(async (strategy, options) => {
    if (!(strategy in dbStrategies)) {
      console.error(chalk.red(`${strategy} strategy invalid`));
      process.exit(1);
    }
    const dbStrategy = dbStrategies[strategy];
    // await dbStrategy.installDependencies();
    dbStrategy.copyDrizzleConfig();
    dbStrategy.copyMigrateScript();
    dbStrategy.copySchema();
    copyConfig();
    copyEnvLocal();
    dbStrategy.appendDbUrl();
    dbStrategy.copyDbInstance();
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
  .requiredOption("-d, --database <database>", "specify database")
  .action(async (table, options) => {
    console.log(table);
    console.log(options);
    if (!(options.database in dbStrategies)) {
      console.log(chalk.red(`${options.database} invalid strategy`));
      process.exit(1);
    }
    // await runCommand("npx shadcn-ui@latest add -y -o table", []);
    // await runCommand("npm install @tanstack/react-table", []);
    // await runCommand("npx shadcn-ui@latest add -y -o label", []);
    // await runCommand("npx shadcn-ui@latest add -y -o input", []);
    // await runCommand("npx shadcn-ui@latest add -y -o button", []);
    // await runCommand("npx install zod", []);
    // await runCommand("npx install drizzle-zod", []);
    copyDataTable();
    const strategy = dbStrategies[options.database];
    strategy.scaffold({ table, columns: options.columns });
  });

program.parse();
