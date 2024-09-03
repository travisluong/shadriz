#!/usr/bin/env node

import { Command } from "commander";
import { log } from "./lib/log";
import { AuthorizationLevel, ShadrizConfig } from "./lib/types";
import { ScaffoldProcessor } from "./processors/scaffold-processor";
import { checkbox, select, confirm } from "@inquirer/prompts";
import {
  completeShadrizConfig,
  loadShadrizConfig,
  regenerateSchemaIndex,
  spawnCommand,
  writeToFile,
} from "./lib/utils";
import {
  dialectStrategyFactory,
  packageStrategyFactory,
} from "./lib/strategy-factory";
import { AuthProcessor } from "./processors/auth-processor";
import { NewProjectProcessor } from "./processors/new-project-processor";
import { DarkModeProcessor } from "./processors/dark-mode-processor";
import { StripeProcessor } from "./processors/stripe-processor";
import { AdminProcessor } from "./processors/admin-processor";
import fs from "fs";
import { PkStrategyProcessor } from "./processors/pk-strategy-processor";
import { DbDialectProcessor } from "./processors/db-dialect-processor";
import packageShadrizJson from "./package-shadriz.json";

const VERSION = "2.0.3";

const program = new Command();

program
  .name("shadriz")
  .description(
    "shadriz - full stack framework next.js shadcn/ui and drizzle orm"
  )
  .version(VERSION);

program
  .command("new")
  .description(
    "initialize a new next.js project using recommended settings for shadriz"
  )
  .argument("<name>", "name of project")
  .action(async (name, options) => {
    const pinnedVersion = packageShadrizJson.dependencies["next"];
    let version;

    const packageManager = await select({
      message: "Which package manager do you want to use?",
      choices: [{ value: "npm" }, { value: "pnpm" }],
    });

    const latest = await select({
      message: `Do you want to install the latest Next.js version or the pinned version ${pinnedVersion}?`,
      choices: [
        {
          name: "pinned",
          value: false,
          description: `Installs the pinned Next.js version ${pinnedVersion}. More stable, but possibly obsolete.`,
        },
        {
          name: "latest",
          value: true,
          description:
            "Installs the latest Next.js version. Less stable, but cutting edge.",
        },
      ],
    });

    if (latest) {
      version = "latest";
    } else {
      version = pinnedVersion;
    }

    try {
      if (packageManager === "pnpm") {
        await spawnCommand(
          `pnpm create next-app@${version} ${name} --typescript --eslint --tailwind --app --no-src-dir --no-import-alias`
        );
      } else {
        await spawnCommand(
          `npx create-next-app@${version} ${name} --typescript --eslint --tailwind --app --no-src-dir --no-import-alias`
        );
      }
    } catch (error) {}
  });

program
  .command("init")
  .description("initialize project")
  .option("--no-install", "skip installation of dependencies")
  .action(async (options) => {
    try {
      // inquire

      const partialConfig: Partial<ShadrizConfig> = {};
      partialConfig.version = VERSION;
      partialConfig.packageManager = await select({
        message: "Which package manager do you want to use?",
        choices: [{ value: "npm" }, { value: "pnpm" }],
      });

      if (options.install) {
        partialConfig.latest = await select({
          message: "Do you want to install latest packages or pinned packages?",
          choices: [
            {
              name: "pinned",
              value: false,
              description:
                "Installs pinned packages in package-shadriz.json. More stable, but possibly obsolete.",
            },
            {
              name: "latest",
              value: true,
              description:
                "Installs latest packages. Less stable, but cutting edge.",
            },
          ],
        });
      }
      partialConfig.dbDialect = await select({
        message: "Which database dialect would you like to use?",
        choices: [
          {
            value: "sqlite",
          },
          { value: "postgresql" },
          { value: "mysql" },
        ],
      });
      switch (partialConfig.dbDialect) {
        case "sqlite":
          partialConfig.dbPackage = "better-sqlite3";
          break;
        case "postgresql":
          partialConfig.dbPackage = "pg";
          break;
        case "mysql":
          partialConfig.dbPackage = "mysql2";
          break;
        default:
          break;
      }
      partialConfig.pkStrategy = await select({
        message: "Which primary key generation strategy would you like to use?",
        choices: [
          {
            name: "cuid2",
            value: "cuid2",
            description: "Uses the @paralleldrive/cuid2 package",
          },
          {
            name: "uuidv7",
            value: "uuidv7",
            description: "Uses the uuidv7 package",
          },
          {
            name: "uuidv4",
            value: "uuidv4",
            description: "Uses crypto.randomUUID",
          },
          {
            name: "nanoid",
            value: "nanoid",
            description: "Uses the nanoid package",
          },
        ],
      });
      partialConfig.authSolution = await select({
        message: "Which authentication solution do you want to use?",
        choices: [{ value: "authjs" }, { value: "none" }],
      });
      if (partialConfig.authSolution === "authjs") {
        partialConfig.authProviders = await checkbox({
          message: "Which auth providers would you like to use?",
          choices: [
            { name: "github", value: "github" },
            { name: "google", value: "google" },
            { name: "credentials", value: "credentials" },
            { name: "postmark", value: "postmark" },
            { name: "nodemailer", value: "nodemailer" },
          ],
        });
        partialConfig.sessionStrategy = await select({
          message: "Which session strategy would you like to use?",
          choices: [
            { name: "database", value: "database" },
            { name: "jwt", value: "jwt" },
          ],
        });
      }
      if (partialConfig.authSolution !== "none") {
        partialConfig.adminEnabled = await confirm({
          message:
            "Do you want to add an admin dashboard with role-based authorization?",
          default: true,
        });
      }
      if (partialConfig.authSolution !== "none") {
        partialConfig.stripeEnabled = await confirm({
          message: "Do you want to add Stripe for payments?",
        });
      }
      partialConfig.darkModeEnabled = await confirm({
        message: "Do you want to add a dark mode toggle?",
        default: true,
      });

      // process

      const completeConfig = completeShadrizConfig(partialConfig);

      const newProjectProcessor = new NewProjectProcessor({
        packageManager: completeConfig.packageManager,
        install: options.install,
        latest: completeConfig.latest,
        darkMode: completeConfig.darkModeEnabled,
        authEnabled: completeConfig.authSolution !== "none",
        stripeEnabled: !!completeConfig.stripeEnabled,
      });
      const dbPackageStrategy = packageStrategyFactory(
        completeConfig.dbPackage,
        {
          packageManager: completeConfig.packageManager,
          install: options.install,
          latest: completeConfig.latest,
        }
      );
      const dbDialectStrategy = dialectStrategyFactory(partialConfig.dbDialect);
      const dbDialectProcessor = new DbDialectProcessor({
        dbDialect: completeConfig.dbDialect,
        install: options.install,
        latest: completeConfig.latest,
        packageManager: completeConfig.packageManager,
      });
      const pkStrategyProcessor = new PkStrategyProcessor({
        packageManager: completeConfig.packageManager,
        install: options.install,
        latest: completeConfig.latest,
        pkStrategy: completeConfig.pkStrategy,
      });

      let authProcessor;
      let adminProcessor;
      let stripeProcessor;

      if (completeConfig.authSolution !== "none") {
        authProcessor = new AuthProcessor({
          packageManager: completeConfig.packageManager,
          providers: completeConfig.authProviders,
          sessionStrategy: completeConfig.sessionStrategy!,
          install: options.install,
          latest: completeConfig.latest,
          stripeEnabled: completeConfig.stripeEnabled,
          pkStrategy: completeConfig.pkStrategy!,
          dbDialectStrategy: dbDialectStrategy,
          dbDialect: completeConfig.dbDialect,
        });
      }
      if (completeConfig.authSolution !== "none") {
        adminProcessor = new AdminProcessor({
          packageManager: partialConfig.packageManager,
          install: options.install,
          latest: completeConfig.latest,
          dbDialect: completeConfig.dbDialect,
          dbDialectStrategy: dbDialectStrategy,
          pkStrategy: completeConfig.pkStrategy,
          dbPackage: completeConfig.dbPackage,
        });
      }
      if (completeConfig.stripeEnabled) {
        stripeProcessor = new StripeProcessor({
          dbDialectStrategy: dbDialectStrategy,
          packageManager: completeConfig.packageManager,
          install: options.install,
          latest: completeConfig.latest,
          pkStrategy: completeConfig.pkStrategy!,
          dbDialect: completeConfig.dbDialect,
        });
      }
      await newProjectProcessor.init();
      await dbPackageStrategy.init();
      dbDialectProcessor.init();
      await pkStrategyProcessor.init();
      if (completeConfig.darkModeEnabled) {
        const darkModeProcessor = new DarkModeProcessor({
          packageManager: completeConfig.packageManager,
          install: options.install,
          latest: completeConfig.latest,
        });
        await darkModeProcessor.init();
      }
      writeToFile(
        "shadriz.config.json",
        JSON.stringify(completeConfig, null, 2)
      );
      if (authProcessor) {
        await authProcessor.init();

        if (adminProcessor) {
          await adminProcessor.init();
        }

        if (stripeProcessor) {
          await stripeProcessor.init();
        }

        regenerateSchemaIndex();
        dbPackageStrategy.printCompletionMessage();
        authProcessor.printCompletionMessage();
        if (adminProcessor) {
          adminProcessor.printCompletionMessage();
        }
        if (stripeProcessor) {
          stripeProcessor.printCompletionMessage();
        }
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

# sqlite example
npx shadriz@latest scaffold post -c title:text content:text is_draft:boolean published_at:text

# postgresql example
npx shadriz@latest scaffold post -c title:text content:text is_draft:boolean published_at:timestamp

# mysql example
npx shadriz@latest scaffold post -c title:varchar content:text is_draft:boolean published_at:timestamp

`
  )
  .argument("<table>", "the database table")
  .requiredOption(
    "-c, --columns <columns...>",
    "column_name:data_type:constraint1,constraint2"
  )
  .action(async (table, options) => {
    const shadrizConfig: ShadrizConfig = loadShadrizConfig();
    let authorizationLevel: AuthorizationLevel = "public";
    if (shadrizConfig.authSolution !== "none" && shadrizConfig.adminEnabled) {
      authorizationLevel = await select({
        message:
          "Which authorization level would you like to use for this scaffold?",
        choices: [
          {
            value: "admin",
            description:
              "Requires authentication and administrative privileges.",
          },
          {
            value: "private",
            description: "Requires user authentication.",
          },
          {
            value: "public",
            description: "Accessible by anyone without authentication.",
          },
        ],
      });
    } else if (shadrizConfig.authSolution !== "none") {
      authorizationLevel = await select({
        message:
          "Which authorization level would you like to use for this scaffold?",
        choices: [
          {
            value: "private",
            description: "Requires user authentication.",
          },
          {
            value: "public",
            description: "Accessible by anyone without authentication.",
          },
        ],
      });
    }

    if (authorizationLevel === "admin" && !fs.existsSync("app/(admin)")) {
      log.bgRed(
        "(admin) route group not found. authorization must be enabled."
      );
      process.exit(1);
    }
    if (authorizationLevel === "private" && !fs.existsSync("app/(private)")) {
      log.bgRed("(private) route group not found. auth must be enabled.");
      process.exit(1);
    }

    const dialectStrategy = dialectStrategyFactory(shadrizConfig.dbDialect);
    const scaffoldProcessor = new ScaffoldProcessor({
      table: table,
      columns: options.columns,
      dbDialectStrategy: dialectStrategy,
      authorizationLevel: authorizationLevel,
      pkStrategy: shadrizConfig.pkStrategy,
      dbDialect: shadrizConfig.dbDialect,
    });
    scaffoldProcessor.process();
  });

program.parse();
