import { Command, Option } from "commander";
import { PackageManager } from "../lib/types";
import { select } from "@inquirer/prompts";
import { spawnCommand } from "../lib/utils";
import packageShadrizzJson from "../package-shadrizz.json";

export const newCommand = new Command("new");

const PINNED_NEXTJS_VERSION = packageShadrizzJson.dependencies["next"];

newCommand
  .description(
    "initialize a new next.js project using recommended settings for shadrizz"
  )
  .argument("<name>", "name of project")
  .addOption(
    new Option(
      "-p, --package-manager <packageManager>",
      "the package manager to initialize next.js with"
    ).choices(["npm", "pnpm", "bun"])
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
        choices: [{ value: "npm" }, { value: "pnpm" }, { value: "bun" }],
      }));

    const latest =
      options.latest ??
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

    const packageManagerRecords: Record<PackageManager, string> = {
      npm: `npx create-next-app@${version} ${name} --typescript --eslint --tailwind --app --no-src-dir --no-import-alias --turbopack`,
      pnpm: `pnpm create next-app@${version} ${name} --typescript --eslint --tailwind --app --no-src-dir --no-import-alias --turbopack`,
      bun: `bun create next-app@${version} ${name}  --typescript --eslint --tailwind --app --no-src-dir --no-import-alias --turbopack`,
    };

    const cmd = packageManagerRecords[packageManager as PackageManager];

    try {
      await spawnCommand(cmd);
    } catch (error) {
      console.error(error);
    }
  });
