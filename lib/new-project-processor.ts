import chalk from "chalk";
import { renderTemplate, spawnCommand } from "./utils";
import path from "path";

interface TemplateToCopy {
  inputPath: string;
  outputPath: string;
}

interface NewProjectProcessorOpts {
  verbose: boolean;
}

export class NewProjectProcessor {
  installCommands = [
    "npm install drizzle-orm --legacy-peer-deps",
    "npm install -D drizzle-kit",
    "npm install dotenv",
    "npm install uuidv7",
    "npm install zod",
    "npm install drizzle-zod",
    "npm install @tanstack/react-table",
  ];

  shadcnCommands = [
    "npx shadcn-ui@latest init -y -d",
    "npx shadcn-ui@latest add -y -o table",
    "npx shadcn-ui@latest add -y -o label",
    "npx shadcn-ui@latest add -y -o input",
    "npx shadcn-ui@latest add -y -o button",
    "npx shadcn-ui@latest add -y -o textarea",
  ];

  templatesToCopy: TemplateToCopy[] = [
    {
      inputPath: ".env.local.hbs",
      outputPath: ".env.local",
    },
    {
      inputPath: "lib/config.ts.hbs",
      outputPath: "lib/config.ts",
    },
    {
      inputPath: "components/ui/data-table.tsx.hbs",
      outputPath: "components/ui/data-table.tsx",
    },
  ];

  constructor(public name: string, public opts?: NewProjectProcessorOpts) {
    this.opts = {
      verbose: false,
      ...opts,
    };
  }

  async init() {
    await this.createNewProject();
    this.changeDir();
    await this.installDependencies();
    await this.initShadcn();
    this.copyTemplates();
    console.log(chalk.bgGreen("✅ success. project created at " + this.name));
  }

  async createNewProject() {
    const cmd = `npx create-next-app ${this.name} --ts --eslint --tailwind --app --no-src-dir --no-import-alias`;
    console.log(chalk.bgBlue(cmd));
    await this.runCommand(cmd);
  }

  changeDir() {
    process.chdir(path.resolve(this.name));
  }

  async installDependencies() {
    for (const cmd of this.installCommands) {
      console.log(chalk.bgBlue(cmd));
      const output = await this.runCommand(cmd);
    }
  }

  copyTemplates() {
    for (const templateToCopy of this.templatesToCopy) {
      console.log(chalk.bgBlue("copy " + templateToCopy.outputPath));
      renderTemplate({
        inputPath: templateToCopy.inputPath,
        outputPath: templateToCopy.outputPath,
      });
    }
  }

  async initShadcn() {
    for (const cmd of this.shadcnCommands) {
      console.log(chalk.bgBlue(cmd));
      await this.runCommand(cmd);
    }
  }

  async runCommand(cmd) {
    await spawnCommand(cmd);
  }
}
