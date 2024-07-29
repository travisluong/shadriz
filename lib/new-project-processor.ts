import { NewProjectProcessorOpts } from "./types";
import {
  renderTemplate,
  renderTemplateIfNotExists,
  spawnCommand,
} from "./utils";
import { getReadme } from "./markdown";

interface TemplateToCopy {
  inputPath: string;
  outputPath: string;
}

export class NewProjectProcessor {
  opts: NewProjectProcessorOpts;

  installCommands = [
    "npm install drizzle-orm --legacy-peer-deps",
    "npm install -D drizzle-kit",
    "npm install dotenv",
    "npm install uuidv7",
    "npm install zod",
    "npm install drizzle-zod",
    "npm install @tanstack/react-table",
    "npm install nanoid",
    "npm install nanoid-dictionary@beta",
  ];

  pnpmInstallCommands = [
    "pnpm add drizzle-orm",
    "pnpm add -D drizzle-kit",
    "pnpm add dotenv",
    "pnpm add uuidv7",
    "pnpm add zod",
    "pnpm add drizzle-zod",
    "pnpm add @tanstack/react-table",
    "pnpm add nanoid",
    "pnpm add nanoid-dictionary@beta",
  ];

  shadcnCommands = [
    "npx shadcn-ui@latest init -y -d",
    "npx shadcn-ui@latest add -y -o table",
    "npx shadcn-ui@latest add -y -o label",
    "npx shadcn-ui@latest add -y -o input",
    "npx shadcn-ui@latest add -y -o button",
    "npx shadcn-ui@latest add -y -o textarea",
    "npx shadcn-ui@latest add -y -o checkbox",
  ];

  pnpmShadcnCommands = [
    "pnpm dlx shadcn-ui@latest init -y -d",
    "pnpm dlx shadcn-ui@latest add -y -o table",
    "pnpm dlx shadcn-ui@latest add -y -o label",
    "pnpm dlx shadcn-ui@latest add -y -o input",
    "pnpm dlx shadcn-ui@latest add -y -o button",
    "pnpm dlx shadcn-ui@latest add -y -o textarea",
    "pnpm dlx shadcn-ui@latest add -y -o checkbox",
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

  constructor(opts: NewProjectProcessorOpts) {
    this.opts = opts;
  }

  async init() {
    this.addHomePage();
    this.addSignInPage();
    this.addDocsCSS();
    this.addHeader();
    this.addFooter();
    this.addPublicLayout();
    this.addDashboardPlaceholder();
    this.addFileUtils();
    await this.addDocsPage();
    await this.installDependencies();
    await this.initShadcn();
    this.copyTemplates();
  }

  addDocsCSS() {
    renderTemplate({
      inputPath: "styles/docs.css",
      outputPath: "styles/docs.css",
    });
  }

  async installDependencies() {
    if (!this.opts.install) {
      return;
    }
    if (this.opts.pnpm) {
      for (const cmd of this.pnpmInstallCommands) {
        await this.runCommand(cmd);
      }
    } else {
      for (const cmd of this.installCommands) {
        await this.runCommand(cmd);
      }
    }
  }

  copyTemplates() {
    for (const templateToCopy of this.templatesToCopy) {
      renderTemplateIfNotExists({
        inputPath: templateToCopy.inputPath,
        outputPath: templateToCopy.outputPath,
      });
    }
  }

  async initShadcn() {
    if (!this.opts.install) {
      return;
    }
    if (this.opts.pnpm) {
      for (const cmd of this.pnpmShadcnCommands) {
        await this.runCommand(cmd);
      }
    } else {
      for (const cmd of this.shadcnCommands) {
        await this.runCommand(cmd);
      }
    }
  }

  async runCommand(cmd: string) {
    await spawnCommand(cmd);
  }

  async addDocsPage() {
    const html = await getReadme();
    renderTemplate({
      inputPath: "app/(public)/docs/page.tsx.hbs",
      outputPath: "app/(public)/docs/page.tsx",
      data: { readme: html },
    });
  }

  addHomePage() {
    renderTemplate({
      inputPath: "app/page.tsx.hbs",
      outputPath: "app/page.tsx",
    });
  }

  addSignInPage() {
    renderTemplate({
      inputPath: "app/signin/page.tsx.hbs",
      outputPath: "app/signin/page.tsx",
    });
  }

  addHeader() {
    renderTemplate({
      inputPath: "components/header.tsx.hbs",
      outputPath: "components/header.tsx",
    });
  }

  addFooter() {
    renderTemplate({
      inputPath: "components/footer.tsx.hbs",
      outputPath: "components/footer.tsx",
    });
  }

  addPublicLayout() {
    renderTemplate({
      inputPath: "app/(public)/layout.tsx.hbs",
      outputPath: "app/(public)/layout.tsx",
    });
  }

  addDashboardPlaceholder() {
    renderTemplate({
      inputPath: "app/(private)/dashboard/page.tsx.init.hbs",
      outputPath: "app/(private)/dashboard/page.tsx",
    });
  }

  addFileUtils() {
    renderTemplate({
      inputPath: "lib/file-utils.ts.hbs",
      outputPath: "lib/file-utils.ts",
    });
  }
}
