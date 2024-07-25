#!/usr/bin/env node

import { Command } from "commander";
import { log } from "./lib/log";
import { AuthProvider, DbPackage, SessionStrategy } from "./lib/types";
import { ScaffoldProcessor } from "./lib/scaffold-processor";
import { checkbox, select } from "@inquirer/prompts";
import toggle from "inquirer-toggle";
import { regenerateSchemaIndex, spawnCommand } from "./lib/utils";
import {
  dialectStrategyFactory,
  packageStrategyFactory,
} from "./lib/strategy-factory";
import { AuthProcessor } from "./lib/auth-processor";
import { NewProjectProcessor } from "./lib/new-project-processor";
import { DarkModeProcessor } from "./lib/dark-mode-processor";

const program = new Command();

program
  .name("shadriz")
  .description(
    "shadriz - full stack framework next.js shadcn/ui and drizzle orm"
  )
  .version("1.2.0");

program
  .command("new")
  .description(
    "initialize a new next.js project using recommended settings for shadriz"
  )
  .argument("<name>", "name of project")
  .option("--pnpm", "run with pnpm", false)
  .action(async (name, options) => {
    try {
      if (options.pnpm) {
        await spawnCommand(
          `pnpm create next-app ${name} --typescript --eslint --tailwind --app --no-src-dir --no-import-alias`
        );
      } else {
        await spawnCommand(
          `npx create-next-app ${name} --typescript --eslint --tailwind --app --no-src-dir --no-import-alias`
        );
      }
    } catch (error) {}
  });

program
  .command("init")
  .description("initialize project")
  .option("--pnpm", "run with pnpm", false)
  .action(async (options) => {
    try {
      const dbPackage = await select({
        message: "Which database library would you like to use?",
        choices: [
          { name: "pg", value: "pg" },
          { name: "mysql2", value: "mysql2" },
          { name: "better-sqlite3", value: "better-sqlite3" },
        ],
      });
      const authEnabled = await toggle({
        message: "Do you want to use Auth.js for authentication?",
        default: true,
      });
      let authProcessor;
      if (authEnabled) {
        const authProviders = await checkbox({
          message: "Which auth providers would you like to use?",
          choices: [
            { name: "github", value: "github" },
            { name: "google", value: "google" },
            { name: "credentials", value: "credentials" },
          ],
        });
        const authStrategy = await select({
          message: "Which session strategy would you like to use?",
          choices: [
            { name: "jwt", value: "jwt" },
            { name: "database", value: "database" },
          ],
        });
        if (authProviders.includes("credentials") && authStrategy !== "jwt") {
          log.bgRed("jwt is required if credentials is selected");
          process.exit(1);
        }
        authProcessor = new AuthProcessor({
          pnpm: options.pnpm,
          providers: authProviders as AuthProvider[],
          sessionStrategy: authStrategy as SessionStrategy,
        });
      }
      const darkModeEnabled = await toggle({
        message: "Do you want to add a dark mode toggle?",
        default: true,
      });
      const newProjectProcessor = new NewProjectProcessor({
        pnpm: options.pnpm,
      });
      const dbPackageStrategy = packageStrategyFactory({
        pnpm: options.pnpm,
        dbPackage: dbPackage as DbPackage,
      });
      const dbDialectStrategy = dialectStrategyFactory(
        dbPackageStrategy.dialect
      );
      await newProjectProcessor.init();
      await dbPackageStrategy.init();
      dbDialectStrategy.init();
      if (darkModeEnabled) {
        const darkModeProcessor = new DarkModeProcessor({
          pnpm: options.pnpm,
        });
        await darkModeProcessor.init();
      }
      if (authProcessor) {
        await authProcessor.init();
        dbDialectStrategy.addAuthSchema();
        dbDialectStrategy.copyCreateUserScript();
        regenerateSchemaIndex();
        authProcessor.printCompletionMessage();
      } else {
        regenerateSchemaIndex();
      }
    } catch (error) {
      log.bgRed(`${error}`);
    }
  });

program
  .command("scaffold")
  .summary("scaffold crud ui, db schema, migration, and actions")
  .description(
    `Generate CRUD ui, db schema, db migration, and server actions for a table

# postgresql uuid primary key examples:
scaffold post -d postgresql -c id:uuid:pk:default-uuidv7 title:text created_at:timestamp:default-now
scaffold post -d postgresql -c id:uuid:pk:default-uuidv4 title:text created_at:timestamp:default-now

# postgresql auto increment primary key examples:
scaffold post -d postgresql -c id:bigserial:pk title:text created_at:timestamp:default-now
scaffold post -d postgresql -c id:serial:pk title:text created_at:timestamp:default-now

# postgresql foreign key examples:
scaffold post -d postgresql -c id:bigserial:pk title:text
scaffold comment -d postgresql -c id:bigserial:pk post_id:bigint:fk-post.id content:text

# mysql uuid primary key examples:
scaffold post -d mysql -c id:varchar:pk:default-uuidv7 title:varchar created_at:timestamp:default-now
scaffold post -d mysql -c id:varchar:pk:default-uuidv4 title:varchar created_at:timestamp:default-now

# mysql auto increment primary key examples:
scaffold post -d mysql -c id:serial:pk title:varchar created_at:timestamp:default-now
scaffold post -d mysql -c id:integer:pk-auto title:varchar created_at:timestamp:default-now

# mysql foreign key examples:
scaffold post -d mysql -c id:serial:pk title:varchar
scaffold comment -d mysql -c id:serial:pk post_id:bigint:fk-post.id content:text

# sqlite uuid primary key examples:
scaffold post -d sqlite -c id:text:pk:default-uuidv7 title:text created_at:text:default-now
scaffold post -d sqlite -c id:text:pk:default-uuidv4 title:text created_at:text:default-now

# sqlite auto increment primary key examples:
scaffold post -d sqlite -c id:integer:pk-auto title:text created_at:text:default-now

# sqlite foreign key examples:
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
    const dialectStrategy = dialectStrategyFactory(options.dialect);
    const scaffoldProcessor = new ScaffoldProcessor({
      table: table,
      columns: options.columns,
      dbDialectStrategy: dialectStrategy,
      private: options.private,
    });
    scaffoldProcessor.process();
  });

program.parse();
