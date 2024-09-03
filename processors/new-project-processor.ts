import { NewProjectProcessorOpts, ShadrizProcessor } from "../lib/types";
import {
  addShadcnComponents,
  installDependencies,
  installDevDependencies,
  renderTemplate,
  renderTemplateIfNotExists,
  spawnCommand,
} from "../lib/utils";
import { getReadme, getTableOfContents } from "../lib/markdown";
import packageShadrizJson from "../package-shadriz.json";

export class NewProjectProcessor implements ShadrizProcessor {
  opts: NewProjectProcessorOpts;

  dependencies = ["drizzle-orm", "dotenv", "zod", "drizzle-zod"];

  devDependencies = ["drizzle-kit"];

  shadcnComponents: string[] = [
    "table",
    "label",
    "input",
    "button",
    "textarea",
    "checkbox",
    "select",
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

    const pinnedVersion = packageShadrizJson.dependencies["shadcn"];
    if (!pinnedVersion) {
      throw new Error("pinned version not found for shadcn");
    }
    let version;
    if (this.opts.latest) {
      version = "latest";
    } else {
      version = pinnedVersion;
    }

    if (this.opts.packageManager === "pnpm") {
      await spawnCommand(`pnpm dlx shadcn@${version} init -y -d`);
    } else if (this.opts.packageManager === "npm") {
      await spawnCommand(`npx shadcn@${version} init -y -d`);
    }

    await installDependencies({
      dependencies: this.dependencies,
      packageManager: this.opts.packageManager,
      latest: this.opts.latest,
    });

    await installDevDependencies({
      devDependencies: this.devDependencies,
      packageManager: this.opts.packageManager,
      latest: this.opts.latest,
    });

    await addShadcnComponents({
      packageManager: this.opts.packageManager,
      shadcnComponents: this.shadcnComponents,
      latest: this.opts.latest,
    });
  }

  async render() {
    const html = await getReadme();
    const toc = await getTableOfContents();

    renderTemplate({
      inputPath: "new-project-processor/app/(public)/docs/page.tsx.hbs",
      outputPath: "app/(public)/docs/page.tsx",
      data: { readme: html, toc: toc },
    });

    renderTemplate({
      inputPath: "new-project-processor/app/page.tsx.hbs",
      outputPath: "app/page.tsx",
    });

    renderTemplate({
      inputPath: "new-project-processor/components/header.tsx.hbs",
      outputPath: "components/header.tsx",
      data: {
        darkMode: this.opts.darkMode,
        authEnabled: this.opts.authEnabled,
        stripeEnabled: this.opts.stripeEnabled,
      },
    });

    renderTemplate({
      inputPath: "new-project-processor/components/footer.tsx.hbs",
      outputPath: "components/footer.tsx",
    });

    renderTemplate({
      inputPath: "new-project-processor/app/(public)/layout.tsx.hbs",
      outputPath: "app/(public)/layout.tsx",
    });

    renderTemplate({
      inputPath: "new-project-processor/lib/file-utils.ts.hbs",
      outputPath: "lib/file-utils.ts",
    });

    renderTemplate({
      inputPath: "new-project-processor/styles/docs.css",
      outputPath: "styles/docs.css",
    });

    renderTemplateIfNotExists({
      inputPath: "new-project-processor/.env.local.hbs",
      outputPath: ".env.local",
    });

    renderTemplate({
      inputPath: "new-project-processor/lib/config.ts.hbs",
      outputPath: "lib/config.ts",
    });

    renderTemplate({
      inputPath: "new-project-processor/components/pagination.tsx.hbs",
      outputPath: "components/pagination.tsx",
    });
  }
}
