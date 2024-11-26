import { log } from "../lib/log";
import { dialectStrategyFactory } from "../lib/strategy-factory";
import {
  DbDialect,
  DbDialectStrategy,
  ShadrizzConfig,
  ShadrizzProcessor,
} from "../lib/types";
import {
  appendToFileIfTextNotExists,
  renderTemplate,
  renderTemplateIfNotExists,
} from "../lib/utils";
import { ScaffoldProcessor } from "./scaffold-processor";
import { caseFactory } from "../lib/case-utils";

export class AdminProcessor implements ShadrizzProcessor {
  opts: ShadrizzConfig;
  dependencies: string[] = [];
  devDependencies: string[] = [];
  shadcnComponents: string[] = ["card"];
  dbDialectStrategy: DbDialectStrategy;

  constructor(opts: ShadrizzConfig) {
    this.dbDialectStrategy = dialectStrategyFactory(opts.dbDialect);
    this.opts = opts;
  }

  async init(): Promise<void> {
    log.init("initializing admin...");
    await this.render();
  }

  async render(): Promise<void> {
    const userObj = caseFactory("user", {
      pluralize: this.opts.pluralizeEnabled,
    });
    renderTemplate({
      inputPath: "admin-processor/app/(admin)/layout.tsx.hbs",
      outputPath: "app/(admin)/layout.tsx",
      data: { userObj },
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
      inputPath: `admin-processor/scripts/grant-admin.ts.hbs`,
      outputPath: "scripts/grant-admin.ts",
      data: {
        userObj,
      },
    });

    renderTemplateIfNotExists({
      inputPath: `admin-processor/components/admin/admin-sidebar.tsx.hbs`,
      outputPath: `components/admin/admin-sidebar.tsx`,
      data: {
        userObj,
      },
    });

    renderTemplate({
      inputPath: "admin-processor/app/(admin)/admin/settings/page.tsx.hbs",
      outputPath: "app/(admin)/admin/settings/page.tsx",
    });

    renderTemplate({
      inputPath: "admin-processor/services/authorization-service.ts.hbs",
      outputPath: "services/authorization-service.ts",
    });

    renderTemplate({
      inputPath:
        "admin-processor/components/admin-login/admin-login-form.tsx.hbs",
      outputPath: "components/admin-login/admin-login-form.tsx",
    });

    renderTemplate({
      inputPath: "admin-processor/actions/admin-login/admin-login.ts.hbs",
      outputPath: "actions/admin-login/admin-login.ts",
    });

    renderTemplate({
      inputPath: "admin-processor/scripts/create-password-hash.ts.hbs",
      outputPath: "scripts/create-password-hash.ts",
    });

    renderTemplate({
      inputPath: "admin-processor/app/(admin)/error.tsx.hbs",
      outputPath: "app/(admin)/error.tsx",
    });

    const strategies: Record<DbDialect, string[]> = {
      postgresql: [
        "name:text",
        "email:text",
        "email_verified:timestamp",
        "image:text",
        "role:text",
        "password:text",
      ],
      mysql: [
        "name:varchar",
        "email:varchar",
        "email_verified:timestamp",
        "image:varchar",
        "role:text",
        "password:varchar",
      ],
      sqlite: [
        "name:text",
        "email:text",
        "email_verified:timestamp",
        "image:text",
        "role:text",
        "password:text",
      ],
    };

    const userScaffold = new ScaffoldProcessor({
      ...this.opts,
      authorizationLevel: "admin",
      columns: strategies[this.opts.dbDialect],
      table: this.opts.pluralizeEnabled ? "users" : "user",
      enableCompletionMessage: false,
      enableSchemaGeneration: false,
    });

    userScaffold.process();
  }

  appendSidebarStylesToGlobalCSS() {
    const css = `\n@layer base {
  :root {
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}
`;

    appendToFileIfTextNotExists("app/globals.css", css, css);
  }

  printCompletionMessage() {
    log.checklist("admin checklist");
    log.task("grant admin privilege");
    log.cmdsubtask("npx tsx scripts/grant-admin.ts user@example.com");
  }
}
