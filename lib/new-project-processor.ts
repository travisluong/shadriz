import { NewProjectProcessorOpts, ShadrizProcessor } from "./types";
import {
  addShadcnComponents,
  installDependencies,
  installDevDependencies,
  renderTemplate,
  spawnCommand,
} from "./utils";
import { getReadme, getTableOfContents } from "./markdown";

export class NewProjectProcessor implements ShadrizProcessor {
  opts: NewProjectProcessorOpts;

  dependencies = [
    "drizzle-orm",
    "dotenv",
    "uuidv7",
    "zod",
    "drizzle-zod",
    "@tanstack/react-table",
    "nanoid",
    "nanoid-dictionary",
  ];

  devDependencies = ["drizzle-kit"];

  shadcnComponents: string[] = [
    "table",
    "label",
    "input",
    "button",
    "textarea",
    "checkbox",
  ];

  constructor(opts: NewProjectProcessorOpts) {
    this.opts = opts;
  }

  async init() {
    await this.install();
    await this.render();
  }

  async install() {
    if (!this.opts.install) {
      return;
    }

    if (this.opts.pnpm) {
      await spawnCommand("pnpm dlx shadcn-ui@latest init -y -d");
    } else {
      await spawnCommand("npx shadcn-ui@latest init -y -d");
    }

    await installDependencies({
      dependencies: this.dependencies,
      pnpm: this.opts.pnpm,
      latest: this.opts.latest,
    });

    await installDevDependencies({
      devDependencies: this.devDependencies,
      pnpm: this.opts.pnpm,
      latest: this.opts.latest,
    });

    await addShadcnComponents({
      pnpm: this.opts.pnpm,
      shadcnComponents: this.shadcnComponents,
    });
  }

  async render() {
    console.log(1);

    const html = await getReadme();
    console.log(2);
    const toc = await getTableOfContents();
    console.log(3);
    renderTemplate({
      inputPath: "app/(public)/docs/page.tsx.hbs",
      outputPath: "app/(public)/docs/page.tsx",
      data: { readme: html, toc: toc },
    });
    console.log(4);
    renderTemplate({
      inputPath: "app/page.tsx.hbs",
      outputPath: "app/page.tsx",
    });

    renderTemplate({
      inputPath: "app/signin/page.tsx.hbs",
      outputPath: "app/signin/page.tsx",
    });

    renderTemplate({
      inputPath: "components/header.tsx.hbs",
      outputPath: "components/header.tsx",
    });

    renderTemplate({
      inputPath: "components/footer.tsx.hbs",
      outputPath: "components/footer.tsx",
    });

    renderTemplate({
      inputPath: "app/(public)/layout.tsx.hbs",
      outputPath: "app/(public)/layout.tsx",
    });

    renderTemplate({
      inputPath: "app/(private)/dashboard/page.tsx.init.hbs",
      outputPath: "app/(private)/dashboard/page.tsx",
    });

    renderTemplate({
      inputPath: "lib/file-utils.ts.hbs",
      outputPath: "lib/file-utils.ts",
    });

    renderTemplate({
      inputPath: "styles/docs.css",
      outputPath: "styles/docs.css",
    });

    renderTemplate({
      inputPath: ".env.local.hbs",
      outputPath: ".env.local",
    });

    renderTemplate({
      inputPath: "lib/config.ts.hbs",
      outputPath: "lib/config.ts",
    });

    renderTemplate({
      inputPath: "components/ui/data-table.tsx.hbs",
      outputPath: "components/ui/data-table.tsx",
    });
  }
}
