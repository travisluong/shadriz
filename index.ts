#!/usr/bin/env node

import { Command, Option } from "commander";
import { log } from "./lib/log";
import { AuthorizationLevel, ShadrizConfig } from "./lib/types";
import { ScaffoldProcessor } from "./processors/scaffold-processor";
import { checkbox, select, confirm } from "@inquirer/prompts";
import {
  completeShadrizConfig,
  loadShadrizConfig,
  regenerateSchemaIndex,
  runCommand,
  writeToFile,
} from "./lib/utils";
import { packageStrategyFactory } from "./lib/strategy-factory";
import { AuthProcessor } from "./processors/auth-processor";
import { NewProjectProcessor } from "./processors/new-project-processor";
import { DarkModeProcessor } from "./processors/dark-mode-processor";
import { StripeProcessor } from "./processors/stripe-processor";
import { AdminProcessor } from "./processors/admin-processor";
import fs from "fs";
import { PkStrategyProcessor } from "./processors/pk-strategy-processor";
import { DbDialectProcessor } from "./processors/db-dialect-processor";
import packageShadrizJson from "./package-shadriz.json";
import packageJson from "./package.json";

const PINNED_NEXTJS_VERSION = packageShadrizJson.dependencies["next"];

const VERSION = packageJson["version"];

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
  .addOption(
    new Option(
      "-p, --package-manager <packageManager>",
      "the package manager to initialize next.js with"
    ).choices(["npm", "pnpm"])
  )
  .addOption(new Option("-l, --latest", "install the latest next.js version"))
  .option(
    "--no-latest",
    `install the pinned version of next.js (${PINNED_NEXTJS_VERSION})`
  )
  .action(async (name, options) => {
    let version;

    const packageManager =
      options.packageManager ||
      (await select({
        message: "Which package manager do you want to use?",
        choices: [{ value: "npm" }, { value: "pnpm" }],
      }));

    const latest =
      options.latest ||
      (await select({
        message: `Do you want to install the latest Next.js version or the pinned version ${PINNED_NEXTJS_VERSION}?`,
        choices: [
          {
            name: "pinned",
            value: false,
            description: `Installs the pinned Next.js version ${PINNED_NEXTJS_VERSION}. More stable, but possibly obsolete.`,
          },
          {
            name: "latest",
            value: true,
            description:
              "Installs the latest Next.js version. Less stable, but cutting edge.",
          },
        ],
      }));

    if (latest) {
      version = "latest";
    } else {
      version = PINNED_NEXTJS_VERSION;
    }

    try {
      if (packageManager === "pnpm") {
        await runCommand(
          `pnpm create next-app@${version} ${name} --typescript --eslint --tailwind --app --no-src-dir --no-import-alias`
        );
      } else {
        await runCommand(
          `npx create-next-app@${version} ${name} --typescript --eslint --tailwind --app --no-src-dir --no-import-alias`
        );
      }
    } catch (error) {}
  });

program
  .command("init")
  .description("initialize project, application boilerplate, and configuration")
  .option(
    "--no-install",
    "skip installation of dependencies and shadcn components"
  )
  .addOption(
    new Option(
      "-p, --package-manager <packageManager>",
      "the package manager for this project"
    ).choices(["npm", "pnpm"])
  )
  .addOption(
    new Option(
      "-l, --latest",
      "install latest dependencies and shadcn components"
    )
  )
  .addOption(
    new Option(
      "--no-latest",
      "install pinned dependencies and shadcn components specified in package-shadriz.json"
    )
  )
  .addOption(
    new Option("-d, --db-dialect <dbDialect>", "the database dialect").choices([
      "sqlite",
      "postgresql",
      "mysql",
    ])
  )
  .addOption(
    new Option(
      "-pk, --pk-strategy <pkStrategy>",
      "primary key generation strategy"
    ).choices(["cuid2", "uuidv7", "uuidv4", "nanoid"])
  )
  .addOption(
    new Option(
      "-a, --auth-solution <authSolution>",
      "authentication solution"
    ).choices(["authjs", "none"])
  )
  .option(
    "-ap, --auth-providers <authProviders>",
    `comma separated list of authjs providers: github,google,credentials,postmark,nodemailer`,
    (value: string, dummyPrevious: any) => {
      const authProviders = value.split(",");
      const validProviders = new Set([
        "github",
        "google",
        "postmark",
        "nodemailer",
        "credentials",
      ]);
      for (const p of authProviders) {
        if (!validProviders.has(p)) {
          throw new Error("invalid auth provider: " + p);
        }
      }
      return authProviders;
    }
  )
  .addOption(
    new Option(
      "-s, --session-strategy <sessionStrategy>",
      "session strategy"
    ).choices(["database", "jwt"])
  )
  .option("-ad, --admin", "admin dashboard with role-based authorization")
  .option("--no-admin", "no admin dashboard")
  .option("-sp, --stripe", "stripe payment processing")
  .option("--no-stripe", "no stripe")
  .option("-dm, --dark-mode", "dark mode")
  .option("--no-dark-mode", "no dark mode")
  .action(async (options) => {
    try {
      // inquire

      const partialConfig: Partial<ShadrizConfig> = {};
      partialConfig.version = VERSION;
      partialConfig.packageManager =
        options.packageManager ||
        (await select({
          message: "Which package manager do you want to use?",
          choices: [{ value: "npm" }, { value: "pnpm" }],
        }));

      partialConfig.install = options.install;

      if (options.install) {
        partialConfig.latest =
          options.latest ??
          (await select({
            message:
              "Do you want to install latest packages or pinned packages?",
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
          }));
      }
      partialConfig.dbDialect =
        options.dbDialect ||
        (await select({
          message: "Which database dialect would you like to use?",
          choices: [
            {
              value: "sqlite",
            },
            { value: "postgresql" },
            { value: "mysql" },
          ],
        }));

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
      partialConfig.pkStrategy =
        options.pkStrategy ||
        (await select({
          message:
            "Which primary key generation strategy would you like to use?",
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
        }));
      partialConfig.authSolution =
        options.authSolution ||
        (await select({
          message: "Which authentication solution do you want to use?",
          choices: [{ value: "authjs" }, { value: "none" }],
        }));

      if (partialConfig.authSolution === "authjs") {
        partialConfig.authProviders =
          options.authProviders ||
          (await checkbox({
            message: "Which auth providers would you like to use?",
            choices: [
              { name: "github", value: "github" },
              { name: "google", value: "google" },
              { name: "postmark", value: "postmark" },
              { name: "nodemailer", value: "nodemailer" },
              { name: "credentials", value: "credentials" },
            ],
          }));

        partialConfig.sessionStrategy =
          options.sessionStrategy ||
          (await select({
            message: "Which session strategy would you like to use?",
            choices: [
              { name: "database", value: "database" },
              { name: "jwt", value: "jwt" },
            ],
          }));
      }
      if (partialConfig.authSolution !== "none") {
        partialConfig.adminEnabled =
          options.admin ??
          (await confirm({
            message:
              "Do you want to add an admin dashboard with role-based authorization?",
            default: true,
          }));
      }
      if (partialConfig.authSolution !== "none") {
        partialConfig.stripeEnabled =
          options.stripe ??
          (await confirm({
            message: "Do you want to add Stripe for payments?",
          }));
      }
      partialConfig.darkModeEnabled =
        options.darkMode ??
        (await confirm({
          message: "Do you want to add a dark mode toggle?",
          default: true,
        }));

      // process

      const completeConfig = completeShadrizConfig(partialConfig);

      const newProjectProcessor = new NewProjectProcessor(completeConfig);
      const dbPackageStrategy = packageStrategyFactory(completeConfig);
      const dbDialectProcessor = new DbDialectProcessor(completeConfig);
      const pkStrategyProcessor = new PkStrategyProcessor(completeConfig);

      let authProcessor;
      let adminProcessor;
      let stripeProcessor;

      if (completeConfig.authSolution !== "none") {
        authProcessor = new AuthProcessor(completeConfig);
      }
      if (completeConfig.authSolution !== "none") {
        adminProcessor = new AdminProcessor(completeConfig);
      }
      if (completeConfig.stripeEnabled) {
        stripeProcessor = new StripeProcessor(completeConfig);
      }
      await newProjectProcessor.init();
      await dbPackageStrategy.init();
      dbDialectProcessor.init();
      await pkStrategyProcessor.init();
      if (completeConfig.darkModeEnabled) {
        const darkModeProcessor = new DarkModeProcessor(completeConfig);
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

      log.success("shadriz init success");
    } catch (error) {
      log.red(`${error}`);
    }
  });

program
  .command("scaffold")
  .summary("scaffold crud ui, db schema, migration, and actions")
  .description(
    `generate crud ui, db schema, db migration, and server actions for a database table

# sqlite example
npx shadriz@latest scaffold post -c title:text content:text is_draft:boolean published_at:text

# postgresql example
npx shadriz@latest scaffold post -c title:text content:text is_draft:boolean published_at:timestamp

# mysql example
npx shadriz@latest scaffold post -c title:varchar content:text is_draft:boolean published_at:timestamp

`
  )
  .argument("<table>", "the database table name")
  .requiredOption(
    "-c, --columns <columns...>",
    "space separated list of columns in the following format: column_name:data_type"
  )
  .addOption(
    new Option(
      "-a, --authorization-level <authorizationLevel>",
      "the authorization level of this scaffold"
    ).choices(["admin", "private", "public"])
  )
  .action(async (table, options) => {
    const shadrizConfig: ShadrizConfig = loadShadrizConfig();
    const authorizationLevel: AuthorizationLevel =
      options.authorizationLevel ||
      (await select({
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
      }));

    if (authorizationLevel === "admin" && !fs.existsSync("app/(admin)")) {
      log.red("(admin) route group not found. authorization must be enabled.");
      process.exit(1);
    }
    if (authorizationLevel === "private" && !fs.existsSync("app/(private)")) {
      log.red("(private) route group not found. auth must be enabled.");
      process.exit(1);
    }

    const scaffoldProcessor = new ScaffoldProcessor({
      table: table,
      columns: options.columns,
      authorizationLevel: authorizationLevel,
      ...shadrizConfig,
    });
    scaffoldProcessor.process();
  });

program.parse();
