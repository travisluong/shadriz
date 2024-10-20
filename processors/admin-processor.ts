import { log } from "../lib/log";
import { dialectStrategyFactory } from "../lib/strategy-factory";
import {
  DbDialectStrategy,
  ShadrizConfig,
  ShadrizProcessor,
} from "../lib/types";
import {
  insertSchemaToSchemaIndex,
  renderTemplate,
  renderTemplateIfNotExists,
} from "../lib/utils";
import { pkStrategyImportTemplates } from "../lib/pk-strategy";

export class AdminProcessor implements ShadrizProcessor {
  opts: ShadrizConfig;
  dependencies: string[] = [];
  devDependencies: string[] = [];
  shadcnComponents: string[] = ["card"];
  dbDialectStrategy: DbDialectStrategy;

  constructor(opts: ShadrizConfig) {
    this.dbDialectStrategy = dialectStrategyFactory(opts.dbDialect);
    this.opts = opts;
  }

  async init(): Promise<void> {
    log.init("initializing admin...");
    await this.render();
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
      this.dbDialectStrategy.pkStrategyTemplates[this.opts.pkStrategy];

    const pkImport = pkStrategyImportTemplates[this.opts.pkStrategy];

    renderTemplate({
      inputPath: `admin-processor/schema/role-tables.ts.${this.opts.dbPackage}.hbs`,
      outputPath: "schema/role-tables.ts",
      data: {
        pkText: pkText,
        pkImport: pkImport,
        createdAtTemplate: this.dbDialectStrategy.createdAtTemplate,
        updatedAtTemplate: this.dbDialectStrategy.updatedAtTemplate,
      },
    });

    insertSchemaToSchemaIndex("role_tables");

    renderTemplate({
      inputPath: `admin-processor/scripts/grant-admin.ts.hbs`,
      outputPath: "scripts/grant-admin.ts",
    });

    renderTemplateIfNotExists({
      inputPath: `admin-processor/components/admin/admin-sidebar.tsx.hbs`,
      outputPath: `components/admin/admin-sidebar.tsx`,
    });
  }

  printCompletionMessage() {
    log.checklist("admin checklist");
    log.task("grant admin privilege");
    log.cmdsubtask("npx tsx scripts/grant-admin.ts shadriz@example.com");
  }
}
