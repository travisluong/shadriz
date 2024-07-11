import { Command } from "commander";
import chalk from "chalk";
import { DialectStrategy, PackageStrategy } from "./lib/types";
import { pgPackageStrategy } from "./strategies/pg";
import { mysql2Strategy } from "./strategies/mysql2";
import { betterSqlite3Strategy } from "./strategies/better-sqlite3";
import { postgresqlDialectStrategy } from "./dialects/postgresql";
import { sqliteDialectStrategy } from "./dialects/sqlite";
import { AuthProcessor } from "./lib/auth-processor";
import { NewProjectProcessor } from "./lib/new-project-processor";

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
  .option("-v, --verbose", "show stdout and stderr of each command")
  .action(async (name, options) => {
    try {
      const opts = {
        verbose: options.verbose,
      };
      const newProjectProcessor = new NewProjectProcessor(name, opts);
      newProjectProcessor.init();
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
  .argument("<providers...>", "github, google, credentials")
  .action(async (providers, options) => {
    console.log(providers);
    const authScaffold = new AuthProcessor({ providers: providers });
    authScaffold.init();
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
