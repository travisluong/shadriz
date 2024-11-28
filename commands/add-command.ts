import { Command } from "commander";
import { log } from "../lib/log";
import { ShadrizzConfig } from "../lib/types";
import {
  addShadcnComponents,
  installDependencies,
  installDevDependencies,
  loadShadrizzConfig,
} from "../lib/utils";
import { ADD_ON_REGISTRY, getAddOnHelpText } from "../lib/add-on-registry";

export const addCommand = new Command("add");

addCommand
  .summary("add an add-on extension to the application")
  .description(
    `add-ons are extensions that can be added after a project has been initialized\n\navailable add-ons:\n${getAddOnHelpText()}`
  )
  .argument("<extension>", "the name of the add-on extension")
  .option(
    "--no-install",
    "skip installation of dependencies and shadcn components"
  )
  .action(async (name, options) => {
    if (!(name in ADD_ON_REGISTRY)) {
      log.red(`${name} not found in add-on registry`);
      process.exit(1);
    }

    const addOn = ADD_ON_REGISTRY[name as keyof typeof ADD_ON_REGISTRY];
    const Processor = addOn.Processor;

    const shadrizzConfig: ShadrizzConfig = loadShadrizzConfig();

    const processor = new Processor(shadrizzConfig);

    if (options.install) {
      await installDependencies({
        dependencies: processor.dependencies,
        packageManager: shadrizzConfig.packageManager,
        latest: shadrizzConfig.latest,
      });

      await installDevDependencies({
        devDependencies: processor.devDependencies,
        packageManager: shadrizzConfig.packageManager,
        latest: shadrizzConfig.latest,
      });

      await addShadcnComponents({
        shadcnComponents: processor.shadcnComponents,
        packageManager: shadrizzConfig.packageManager,
        latest: shadrizzConfig.latest,
      });
    }

    processor.init();

    processor.printCompletionMessage();
  });
