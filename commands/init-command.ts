import { Command, Option } from "commander";
import { log } from "../lib/log";
import { ShadrizzConfig, ShadrizzProcessor } from "../lib/types";
import { checkbox, select, confirm } from "@inquirer/prompts";
import {
  addShadcnComponents,
  completeShadrizzConfig,
  installDependencies,
  installDevDependencies,
  preflightChecks,
  writeToFile,
} from "../lib/utils";
import { packageStrategyFactory } from "../lib/strategy-factory";
import { AuthProcessor, authStrategyMap } from "../processors/auth-processor";
import { NewProjectProcessor } from "../processors/new-project-processor";
import { DarkModeProcessor } from "../processors/dark-mode-processor";
import { AdminProcessor } from "../processors/admin-processor";
import { DbDialectProcessor } from "../processors/db-dialect-processor";
import packageJson from "../package.json";
import { pkDependencies } from "../lib/pk-strategy";

export const initCommand = new Command("init");

const VERSION = packageJson["version"];

initCommand
  .description("initialize project, application boilerplate, and configuration")
  .option(
    "--no-install",
    "skip installation of dependencies and shadcn components"
  )
  .addOption(
    new Option(
      "-p, --package-manager <packageManager>",
      "the package manager for this project"
    ).choices(["npm", "pnpm", "bun"])
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
      "install pinned dependencies and shadcn components specified in package-shadrizz.json"
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
    ).choices(["cuid2", "uuidv7", "uuidv4", "nanoid", "auto_increment"])
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
        "credentials",
        "github",
        "google",
        "postmark",
        "nodemailer",
      ]);
      for (const p of authProviders) {
        if (!validProviders.has(p)) {
          throw new Error("invalid auth provider: " + p);
        }
      }
      return authProviders;
    }
  )
  .option("-ad, --admin", "admin dashboard with role-based authorization")
  .option("--no-admin", "no admin dashboard")
  .option(
    "--pluralize",
    "enable the automatic pluralization of variable naming conventions"
  )
  .option(
    "--no-pluralize",
    "disable the automatic pluralization of variable naming conventions"
  )
  .action(async (options) => {
    try {
      preflightChecks();

      // inquire

      const partialConfig: Partial<ShadrizzConfig> = {};
      partialConfig.version = VERSION;

      partialConfig.packageManager =
        options.packageManager ||
        (await select({
          message: "Which package manager do you want to use?",
          choices: [{ value: "npm" }, { value: "pnpm" }, { value: "bun" }],
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
                  "Installs pinned packages in package-shadrizz.json. More stable, but possibly obsolete.",
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
            {
              name: "auto_increment",
              value: "auto_increment",
              description:
                "Auto increment. Warning: Does not work with Auth.js Drizzle Adapter.",
            },
          ],
        }));
      partialConfig.authSolution =
        options.authSolution ||
        (await select({
          message: "Which authentication solution do you want to use?",
          choices: [{ value: "authjs" }, { value: "none" }],
        }));
      if (
        partialConfig.pkStrategy === "auto_increment" &&
        partialConfig.authSolution === "authjs"
      ) {
        log.red("auto_increment is not compatible with authjs");
        process.exit(1);
      }
      if (partialConfig.authSolution === "authjs") {
        partialConfig.authProviders =
          options.authProviders ||
          (await checkbox({
            message: "Which auth providers would you like to use?",
            choices: [
              { name: "credentials", value: "credentials", checked: true },
              { name: "github", value: "github" },
              { name: "google", value: "google" },
              { name: "postmark", value: "postmark" },
              { name: "nodemailer", value: "nodemailer" },
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
      partialConfig.pluralizeEnabled =
        options.pluralize ??
        (await confirm({
          message:
            "Do you want to enable the automatic pluralization of table and variable names?",
          default: true,
        }));

      // process

      const processors: ShadrizzProcessor[] = [];

      const completeConfig = completeShadrizzConfig(partialConfig);

      writeToFile(
        "shadrizz.config.json",
        JSON.stringify(completeConfig, null, 2)
      );

      const newProjectProcessor = new NewProjectProcessor(completeConfig);

      await newProjectProcessor.install();

      const dbPackageStrategy = packageStrategyFactory(completeConfig);
      const dbDialectProcessor = new DbDialectProcessor(completeConfig);

      processors.push(newProjectProcessor);
      processors.push(dbPackageStrategy);
      processors.push(dbDialectProcessor);

      let authProcessor;
      let adminProcessor;

      if (completeConfig.authSolution !== "none") {
        authProcessor = new AuthProcessor(completeConfig);
        processors.push(authProcessor);
      }
      if (completeConfig.adminEnabled) {
        adminProcessor = new AdminProcessor(completeConfig);
        processors.push(adminProcessor);
      }

      const dependencies = [];
      const devDependencies = [];
      const shadcnComponents = [];

      dependencies.push(...pkDependencies[completeConfig.pkStrategy]);

      const darkModeProcessor = new DarkModeProcessor(completeConfig);
      processors.push(darkModeProcessor);

      for (const processor of processors) {
        dependencies.push(...processor.dependencies);
        devDependencies.push(...processor.devDependencies);
        shadcnComponents.push(...processor.shadcnComponents);
      }

      for (const authProvider of completeConfig.authProviders) {
        const authStrategy = authStrategyMap[authProvider];
        dependencies.push(...authStrategy.dependencies);
        devDependencies.push(...authStrategy.devDependencies);
      }

      if (completeConfig.install) {
        await installDependencies({
          dependencies,
          packageManager: completeConfig.packageManager,
          latest: completeConfig.latest,
        });

        await installDevDependencies({
          devDependencies,
          packageManager: completeConfig.packageManager,
          latest: completeConfig.latest,
        });

        await addShadcnComponents({
          shadcnComponents,
          packageManager: completeConfig.packageManager,
          latest: completeConfig.latest,
        });
      }

      for (const processor of processors) {
        await processor.init();
      }

      for (const processor of processors) {
        processor.printCompletionMessage();
      }

      log.log("");
      log.success("shadrizz init success");
    } catch (error) {
      log.red(`${error}`);
    }
  });
