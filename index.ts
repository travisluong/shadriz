#!/usr/bin/env node

import { Command } from "commander";
import { PgPackageStrategy } from "./db-packages/pg-package-strategy";
import { BetterSqlite3PackageStrategy } from "./db-packages/better-sqlite3-package-strategy";
import { PostgresqlDialectStrategy } from "./db-dialects/postgresql-dialect-strategy";
import { SqliteDialectStrategy } from "./db-dialects/sqlite-dialect-strategy";
import { AuthProcessor } from "./lib/auth-processor";
import { NewProjectProcessor } from "./lib/new-project-processor";
import { log } from "./lib/log";
import { DbDialectStrategy, DbPackageStrategy } from "./lib/types";
import { Mysql2PackageStrategy } from "./db-packages/mysql2-package-strategy";
import { MysqlDialectStrategy } from "./db-dialects/mysql-dialect-strategy";
import { ScaffoldProcessor } from "./lib/scaffold-processor";
import { regenerateSchemaIndex } from "./lib/utils";

const packageStrategyMap: { [key: string]: DbPackageStrategy } = {
  pg: new PgPackageStrategy(),
  mysql2: new Mysql2PackageStrategy(),
  "better-sqlite3": new BetterSqlite3PackageStrategy(),
};

const dialectStrategyMap: { [key: string]: DbDialectStrategy } = {
  postgresql: new PostgresqlDialectStrategy(),
  mysql: new MysqlDialectStrategy(),
  sqlite: new SqliteDialectStrategy(),
};

const program = new Command();

program
  .name("shadriz")
  .description(
    "shadriz - full stack framework next.js shadcn/ui and drizzle orm"
  )
  .version("1.0.6");

program
  .command("new")
  .description("create a new project with latest dependencies")
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
  .description("generate drizzle orm configuration")
  .argument("<strategy>", "pg, mysql2, better-sqlite3")
  .option("--pnpm", "run with pnpm", false)
  .action(async (strategy, options) => {
    if (!(strategy in packageStrategyMap)) {
      log.bgRed(`${strategy} strategy invalid`);
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
  .summary("generate auth.js configuration")
  .description(
    `generate auth.js configuration

postgresql example with github, google, and credentials provider:
  auth github google credentials -d postgresql

mysql example with github and google provider:
  auth github google -d mysql

sqlite example with credentials provider:
  auth credentials -d sqlite
    `
  )
  .argument("<providers...>", "github, google, credentials")
  .requiredOption("-d, --dialect <dialect>", "postgresql, mysql, sqlite")
  .option("--pnpm", "run with pnpm", false)
  .option("-s, --strategy <strategy>", "database, jwt", "database")
  .action(async (providers, options) => {
    if (!(options.dialect in dialectStrategyMap)) {
      log.bgRed(`invalid dialect ${options.dialect}`);
      process.exit(1);
    }
    const authScaffold = new AuthProcessor({
      providers: providers,
      pnpm: options.pnpm,
      sessionStrategy: options.strategy,
    });
    await authScaffold.init();
    const dialectStrategy = dialectStrategyMap[options.dialect];
    dialectStrategy.addAuthSchema();
    dialectStrategy.copyCreateUserScript();
    regenerateSchemaIndex();
  });

program
  .command("scaffold")
  .summary("scaffold crud ui, db schema, migration, and actions")
  .description(
    `Generate CRUD ui, db schema, db migration, and server actions for a table

postgresql uuid primary key examples:
  scaffold post -d postgresql -c id:uuid:pk:default-uuidv7 title:text created_at:timestamp:default-now
  scaffold post -d postgresql -c id:uuid:pk:default-uuidv4 title:text created_at:timestamp:default-now
  
postgresql auto increment primary key examples:
  scaffold post -d postgresql -c id:bigserial:pk title:text created_at:timestamp:default-now
  scaffold post -d postgresql -c id:serial:pk title:text created_at:timestamp:default-now

mysql uuid primary key examples:
  scaffold post -d mysql -c id:varchar:pk:default-uuidv7 title:varchar created_at:timestamp:default-now
  scaffold post -d mysql -c id:varchar:pk:default-uuidv4 title:varchar created_at:timestamp:default-now
  
mysql auto increment primary key examples:
  scaffold post -d mysql -c id:serial:pk title:varchar created_at:timestamp:default-now
  scaffold post -d mysql -c id:integer:pk-auto title:varchar created_at:timestamp:default-now

sqlite uuid primary key examples:
  scaffold post -d sqlite -c id:text:pk:default-uuidv7 title:text created_at:text:default-now
  scaffold post -d sqlite -c id:text:pk:default-uuidv4 title:text created_at:text:default-now
  
sqlite auto increment primary key examples:
  scaffold post -d sqlite -c id:integer:pk-auto title:text created_at:text:default-now

postgresql foreign key examples:
  scaffold post -d postgresql -c id:bigserial:pk title:text
  scaffold comment -d postgresql -c id:bigserial:pk post_id:bigint:fk-post.id content:text

mysql foreign key examples:
  scaffold post -d mysql -c id:serial:pk title:varchar
  scaffold comment -d mysql -c id:serial:pk post_id:bigint:fk-post.id content:text

sqlite foreign key examples:
  scaffold post -d sqlite -c id:integer:pk-auto title:text
  scaffold post -d sqlite -c id:integer:pk-auto post_id:integer:fk-post.id content:text
`
  )
  .argument("<table>", "table: post, product, order, etc")
  .requiredOption("-d, --dialect <dialect>", "postgresql, mysql, sqlite")
  .requiredOption(
    "-c, --columns <columns...>",
    "column_name:data_type:column-arg1:column-arg2"
  )
  .option(
    "-p, --private",
    "scaffold into app/(private) route group. requires auth to access",
    false
  )
  .action(async (table, options) => {
    if (!(options.dialect in dialectStrategyMap)) {
      log.bgRed(`invalid dialect: ${options.dialect}`);
      process.exit(1);
    }
    const strategy = dialectStrategyMap[options.dialect];
    const scaffoldProcessor = new ScaffoldProcessor({
      table: table,
      columns: options.columns,
      dbDialectStrategy: strategy,
      private: options.private,
    });
    scaffoldProcessor.process();
  });

program.parse();
