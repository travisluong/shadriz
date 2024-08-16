import { log } from "../lib/log";
import { ShadrizProcessor, ShadrizProcessorOpts } from "../lib/types";
import { addShadcnComponents, renderTemplate } from "../lib/utils";

export class AdminProcessor implements ShadrizProcessor {
  opts: ShadrizProcessorOpts;
  dependencies: string[] = [];
  devDependencies: string[] = [];
  shadcnComponents: string[] = ["card"];

  constructor(opts: ShadrizProcessorOpts) {
    this.opts = opts;
  }

  async init(): Promise<void> {
    await this.install();
    await this.render();
  }
  async install(): Promise<void> {
    if (!this.opts.install) {
      return;
    }

    await addShadcnComponents({
      shadcnComponents: this.shadcnComponents,
      packageManager: this.opts.packageManager,
    });
  }
  async render(): Promise<void> {
    renderTemplate({
      inputPath: "admin-processor/app/(admin)/layout.tsx.hbs",
      outputPath: "app/(admin)/layout.tsx",
    });

    renderTemplate({
      inputPath: "admin-processor/app/(admin)/admin/page.tsx.hbs",
      outputPath: "app/(admin)/admin/page.tsx",
    });

    renderTemplate({
      inputPath: "admin-processor/app/admin-login/page.tsx.hbs",
      outputPath: "app/admin-login/page.tsx",
    });

    renderTemplate({
      inputPath: "admin-processor/lib/authorization.ts.hbs",
      outputPath: "lib/authorization.ts",
    });

    renderTemplate({
      inputPath: "admin-processor/schema/roles.ts.hbs",
      outputPath: "schema/roles.ts",
    });

    renderTemplate({
      inputPath: "admin-processor/scripts/create-admin.ts.hbs",
      outputPath: "scripts/create-admin.ts",
    });
  }

  printCompletionMessage() {
    log.white("\ncreate admin user:");
    log.cmd("npx tsx scripts/create-admin.ts admin@example.com password123");
  }
}
