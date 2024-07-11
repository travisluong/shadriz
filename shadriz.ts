import { Command } from "commander";
import chalk from "chalk";
import { DialectStrategy, PackageStrategy } from "./lib/types";
import { PgPackageStrategy } from "./strategies/pg";
import { mysql2Strategy } from "./strategies/mysql2";
import { BetterSqlite3Strategy } from "./strategies/better-sqlite3";
import { PostgresqlDialectStrategy } from "./dialects/postgresql";
import { SqliteDialectStrategy } from "./dialects/sqlite";
import { AuthProcessor } from "./lib/auth-processor";
import { NewProjectProcessor } from "./lib/new-project-processor";

const packageStrategyMap: { [key: string]: PackageStrategy } = {
  pg: new PgPackageStrategy(),
  mysql2: mysql2Strategy,
  "better-sqlite3": new BetterSqlite3Strategy(),
};

const dialectStrategyMap: { [key: string]: DialectStrategy } = {
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
  .action(async (name, options) => {
    try {
      const newProjectProcessor = new NewProjectProcessor(name);
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
    console.log(packageStrategy);

    const dialectStrategy = dialectStrategyMap[packageStrategy.dialect];
    console.log(dialectStrategy);

    await packageStrategy.init();
    dialectStrategy.init();
  });

program
  .command("auth")
  .description("Generate Auth.js configuration")
  .argument("<providers...>", "github, google, credentials")
  .requiredOption("-d, --dialect <dialect>", "postgresql, mysql, sqlite")
  .action(async (providers, options) => {
    if (!(options.dialect in dialectStrategyMap)) {
      console.log(chalk.bgRed(`invalid dialect ${options.dialect}`));
      process.exit(1);
    }
    const authScaffold = new AuthProcessor({ providers: providers });
    const dialectStrategy = dialectStrategyMap[options.dialect];
    authScaffold.init();
    dialectStrategy.appendAuthSchema();
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
      console.log(chalk.red(`invalid dialect: ${options.dialect}`));
      process.exit(1);
    }
    const strategy = dialectStrategyMap[options.dialect];
    strategy.scaffold({ table, columns: options.columns });
  });

program.parse();
