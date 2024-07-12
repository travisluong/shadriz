import { Command } from "commander";
import chalk from "chalk";
import { PgPackageStrategy } from "./db-packages/pg-package-strategy";
import { BetterSqlite3PackageStrategy } from "./db-packages/better-sqlite3-package-strategy";
import { PostgresqlDialectStrategy } from "./db-dialects/postgresql-dialect-strategy";
import { SqliteDialectStrategy } from "./db-dialects/sqlite-dialect-strategy";
import { AuthProcessor } from "./lib/auth-processor";
import { NewProjectProcessor } from "./lib/new-project-processor";
import { log } from "./lib/log";
import { DbDialectStrategy, DbPackageStrategy } from "./lib/types";

const packageStrategyMap: { [key: string]: DbPackageStrategy } = {
  pg: new PgPackageStrategy(),
  "better-sqlite3": new BetterSqlite3PackageStrategy(),
};

const dialectStrategyMap: { [key: string]: DbDialectStrategy } = {
  postgresql: new PostgresqlDialectStrategy(),
  sqlite: new SqliteDialectStrategy(),
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
  .option("--pnpm", "run with pnpm")
  .action(async (name, options) => {
    try {
      const newProjectProcessor = new NewProjectProcessor(name, options);
      newProjectProcessor.init();
    } catch (error) {
      console.error("Error running command:", error);
    }
  });

program
  .command("db")
  .description("Generate Drizzle ORM configuration")
  .argument("<strategy>", "pg, mysql2, better-sqlite3")
  .option("--pnpm", "run with pnpm", false)
  .action(async (strategy, options) => {
    if (!(strategy in packageStrategyMap)) {
      console.error(chalk.red(`${strategy} strategy invalid`));
      process.exit(1);
    }
    const packageStrategy = packageStrategyMap[strategy];
    packageStrategy.setPnpm(options.pnpm);
    const dialectStrategy = dialectStrategyMap[packageStrategy.dialect];
    await packageStrategy.init();
    dialectStrategy.init();
    dialectStrategy.printInitCompletionMessage();
  });

program
  .command("auth")
  .description("Generate Auth.js configuration")
  .argument("<providers...>", "github, google, credentials")
  .requiredOption("-d, --dialect <dialect>", "postgresql, mysql, sqlite")
  .option("--pnpm", "run with pnpm", false)
  .action(async (providers, options) => {
    if (!(options.dialect in dialectStrategyMap)) {
      log.bgRed(`invalid dialect ${options.dialect}`);
      process.exit(1);
    }
    const authScaffold = new AuthProcessor({
      providers: providers,
      pnpm: options.pnpm,
    });
    const dialectStrategy = dialectStrategyMap[options.dialect];
    dialectStrategy.appendAuthSchema();
    dialectStrategy.copyCreateUserScript();
    await authScaffold.init();
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
    if (!(options.dialect in dialectStrategyMap)) {
      log.bgRed(`invalid dialect: ${options.dialect}`);
      process.exit(1);
    }
    const strategy = dialectStrategyMap[options.dialect];
    strategy.scaffold({ table, columns: options.columns });
  });

program.parse();
