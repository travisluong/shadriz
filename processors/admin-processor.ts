import { log } from "../lib/log";
import { AdminProcessorOpts, ShadrizProcessor } from "../lib/types";
import { addShadcnComponents, renderTemplate } from "../lib/utils";
import { pkStrategyImportTemplates } from "./pk-strategy-processor";

export class AdminProcessor implements ShadrizProcessor {
  opts: AdminProcessorOpts;
  dependencies: string[] = [];
  devDependencies: string[] = [];
  shadcnComponents: string[] = ["card"];

  constructor(opts: AdminProcessorOpts) {
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

    const pkText =
      this.opts.dbDialectStrategy.pkStrategyTemplates[this.opts.pkStrategy];

    const pkImport = pkStrategyImportTemplates[this.opts.pkStrategy];

    renderTemplate({
      inputPath: `admin-processor/schema/roles.ts.${this.opts.dbPackage}.hbs`,
      outputPath: "schema/roles.ts",
      data: {
        pkText: pkText,
        pkImport: pkImport,
      },
    });

    renderTemplate({
      inputPath: `admin-processor/scripts/grant-admin.ts.hbs`,
      outputPath: "scripts/grant-admin.ts",
    });
  }

  printCompletionMessage() {
    log.checklist("admin checklist");

    log.white("\ngrant admin privilege:");
    log.cmd("npx tsx scripts/grant-admin.ts shadriz@example.com");
  }
}
