import { log } from "../lib/log";
import {
  PackageManager,
  ShadrizzConfig,
  ShadrizzProcessor,
} from "../lib/types";
import {
  appendToEnvLocal,
  appendToFileIfTextNotExists,
  insertTextAfterIfNotExists,
  removeTextFromFile,
  renderTemplate,
  renderTemplateIfNotExists,
  spawnSyncCommand,
} from "../lib/utils";
import packageShadrizzJson from "../package-shadrizz.json";

export class NewProjectProcessor implements ShadrizzProcessor {
  opts: ShadrizzConfig;

  dependencies = ["drizzle-orm", "dotenv", "zod", "drizzle-zod"];

  devDependencies = ["drizzle-kit", "@types/react", "@types/react-dom"];

  shadcnComponents: string[] = [
    "table",
    "label",
    "input",
    "button",
    "textarea",
    "checkbox",
    "select",
    "popover",
    "command",
    "alert",
  ];

  constructor(opts: ShadrizzConfig) {
    this.opts = opts;
  }

  async init() {
    log.init("initializing new project...");
    await this.render();
  }

  async install() {
    if (!this.opts.install) {
      return;
    }

    const pinnedVersion = packageShadrizzJson.dependencies["shadcn"];
    if (!pinnedVersion) {
      throw new Error("pinned version not found for shadcn");
    }
    let version;
    if (this.opts.latest) {
      version = "latest";
    } else {
      version = pinnedVersion;
    }

    const packageManagerRecords: Record<PackageManager, string> = {
      npm: `npx shadcn@${version} init -y -d`,
      pnpm: `pnpm dlx shadcn@${version} init -y -d`,
      bun: `bunx shadcn@${version} init -y -d`,
    };

    // await runCommand(packageManagerRecords[this.opts.packageManager]);
    spawnSyncCommand(packageManagerRecords[this.opts.packageManager]);
  }

  async render() {
    renderTemplate({
      inputPath: "new-project-processor/app/page.tsx.hbs",
      outputPath: "app/page.tsx",
    });

    renderTemplate({
      inputPath: "new-project-processor/components/header.tsx.hbs",
      outputPath: "components/header.tsx",
      data: {
        opts: this.opts,
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

    renderTemplate({
      inputPath: "new-project-processor/.eslintrc.json.hbs",
      outputPath: ".eslintrc.json",
    });

    renderTemplate({
      inputPath: "new-project-processor/components/search-input.tsx.hbs",
      outputPath: "components/search-input.tsx",
    });

    renderTemplate({
      inputPath: "new-project-processor/lib/search-params-utils.ts.hbs",
      outputPath: "lib/search-params-utils.ts",
    });

    renderTemplate({
      inputPath: "new-project-processor/components/sortable.tsx.hbs",
      outputPath: "components/sortable.tsx",
    });

    renderTemplate({
      inputPath: "new-project-processor/app/(public)/error.tsx.hbs",
      outputPath: "app/(public)/error.tsx",
    });

    renderTemplate({
      inputPath: "new-project-processor/components/custom-table.tsx.hbs",
      outputPath: "components/custom-table.tsx",
    });

    // TODO: remove when next.js and shadcn/ui init works with dark mode
    // prettier-ignore
    removeTextFromFile("app/globals.css", `:root {
  --background: #ffffff;
  --foreground: #171717;
}`);
    // prettier-ignore
    removeTextFromFile("app/globals.css", `@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}`)

    appendToFileIfTextNotExists(".gitignore", "/uploads", "/uploads");

    appendToEnvLocal(
      "NEXT_PUBLIC_UPLOAD_BASE_URL",
      "http://localhost:3000/uploads"
    );

    insertTextAfterIfNotExists(
      "package.json",
      `"scripts": {`,
      `\n    "generate": "drizzle-kit generate",\n    "migrate": "drizzle-kit migrate",`
    );
  }

  printCompletionMessage() {}
}
