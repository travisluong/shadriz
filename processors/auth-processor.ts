import {
  appendToFileIfTextNotExists,
  compileTemplate,
  renderTemplate,
} from "../lib/utils";
import { log } from "../lib/log";
import {
  DbDialect,
  DbDialectStrategy,
  ShadrizConfig,
  ShadrizProcessor,
} from "../lib/types";
import {
  pkKeyValTemplates,
  pkStrategyImportTemplates,
} from "../lib/pk-strategy";
import { dialectStrategyFactory } from "../lib/strategy-factory";

interface AuthStrategy {
  importTemplatePath: string;
  authTemplatePath: string;
  envTemplatePath: string;
  dependencies: string[];
  devDependencies: string[];
  textToSearchInEnv?: string;
  printCompletionMessage(): void;
}

interface AuthStrategyMap {
  github: AuthStrategy;
  google: AuthStrategy;
  credentials: AuthStrategy;
  postmark: AuthStrategy;
  nodemailer: AuthStrategy;
}

export const authStrategyMap: AuthStrategyMap = {
  github: {
    importTemplatePath: "auth-processor/lib/auth.ts.github.imports.hbs",
    authTemplatePath: "auth-processor/lib/auth.ts.github.hbs",
    envTemplatePath: "auth-processor/lib/auth.ts.github.env.hbs",
    printCompletionMessage: function (): void {
      log.task("setup github provider");
      log.subtask(
        "go to github > settings > developer settings > oauth apps > new oauth app"
      );
      log.subtask("callback: http://localhost:3000/api/auth/callback/github");
      log.subtask("update AUTH_GITHUB_ID in .env.local");
      log.subtask("update AUTH_GITHUB_SECRET in .env.local");
    },
    textToSearchInEnv: "AUTH_GITHUB_ID",
    dependencies: [],
    devDependencies: [],
  },
  google: {
    importTemplatePath: "auth-processor/lib/auth.ts.google.imports.hbs",
    authTemplatePath: "auth-processor/lib/auth.ts.google.hbs",
    envTemplatePath: "auth-processor/lib/auth.ts.google.env.hbs",
    printCompletionMessage: function (): void {
      log.task("setup google provider");
      log.subtask(
        "go to console.cloud.google.com > new project > oauth consent screen + 2.0 client"
      );
      log.subtask("callback: http://localhost:3000/api/auth/callback/google");
      log.subtask("update AUTH_GOOGLE_ID in .env.local");
      log.subtask("update AUTH_GOOGLE_SECRET in .env.local");
    },
    textToSearchInEnv: "AUTH_GOOGLE_ID",
    dependencies: [],
    devDependencies: [],
  },
  credentials: {
    importTemplatePath: "auth-processor/lib/auth.ts.credentials.imports.hbs",
    authTemplatePath: "auth-processor/lib/auth.ts.credentials.hbs",
    envTemplatePath: "auth-processor/lib/auth.ts.credentials.env.hbs",
    dependencies: ["bcrypt"],
    devDependencies: ["@types/bcrypt"],
    printCompletionMessage: function (): void {
      log.task("create test user for credentials provider");
      log.cmdsubtask(
        "npx tsx scripts/create-user.ts shadriz@example.com password123"
      );
    },
    textToSearchInEnv: undefined,
  },
  postmark: {
    importTemplatePath: "auth-processor/lib/auth.ts.postmark.imports.hbs",
    authTemplatePath: "auth-processor/lib/auth.ts.postmark.hbs",
    envTemplatePath: "auth-processor/lib/auth.ts.postmark.env.hbs",
    printCompletionMessage: function (): void {
      log.task("setup postmark provider");
      log.subtask("go to postmark > server > api tokens");
      log.subtask("generate token");
      log.subtask("change the from email in auth.ts");
      log.subtask("update AUTH_POSTMARK_KEY in .env.local");
    },
    textToSearchInEnv: "AUTH_POSTMARK_KEY",
    dependencies: [],
    devDependencies: [],
  },
  nodemailer: {
    importTemplatePath: "auth-processor/lib/auth.ts.nodemailer.imports.hbs",
    authTemplatePath: "auth-processor/lib/auth.ts.nodemailer.hbs",
    envTemplatePath: "auth-processor/lib/auth.ts.nodemailer.env.hbs",
    dependencies: ["nodemailer"],
    printCompletionMessage: function (): void {
      log.task("setup nodemailer provider");
      log.subtask("update EMAIL_SERVER in .env.local");
      log.subtask("update EMAIL_FROM in .env.local");
    },
    textToSearchInEnv: "EMAIL_SERVER",
    devDependencies: [],
  },
};

interface AuthDbDialect {
  authSchemaTemplate: string;
  pkDataType: string;
}

const authDbDialectStrategy: Record<DbDialect, AuthDbDialect> = {
  postgresql: {
    authSchemaTemplate: "auth-processor/schema/users.ts.postgresql.hbs",
    pkDataType: "text",
  },
  mysql: {
    authSchemaTemplate: "auth-processor/schema/users.ts.mysql.hbs",
    pkDataType: "varchar",
  },
  sqlite: {
    authSchemaTemplate: "auth-processor/schema/users.ts.sqlite.hbs",
    pkDataType: "text",
  },
};

export class AuthProcessor implements ShadrizProcessor {
  constructor(public opts: ShadrizConfig) {
    this.dbDialectStrategy = dialectStrategyFactory(this.opts.dbDialect);
  }

  dependencies = ["next-auth", "@auth/drizzle-adapter"];

  devDependencies = [];

  shadcnComponents: string[] = ["separator", "avatar"];

  dbDialectStrategy: DbDialectStrategy;

  async init() {
    log.init("initializing auth...");
    this.validateOptions();
    await this.render();
  }

  async render() {
    this.addAuthConfig();
    this.addAuthRouteHandler();
    // this.addAuthMiddleware();
    this.appendSecretsToEnv();
    this.addPrivateLayout();
    this.addPrivateDashboard();
    this.addCustomSignInPage();
    this.addProfilePage();
    this.addSettingsPage();
    this.addAuthSchema();
    this.addAuthTrustHostToEnv();
    this.appendAuthSecretToEnv();
    this.addSignOutPage();
    this.addDashboardSidebar();
  }

  validateOptions() {
    for (const provider of this.opts.authProviders) {
      if (!(provider in authStrategyMap)) {
        throw new Error("invalid provider: " + provider);
      }
    }

    if (!["jwt", "database"].includes(this.opts.sessionStrategy)) {
      throw new Error("invalid session strategy: " + this.opts.sessionStrategy);
    }

    // if (
    //   this.opts.providers.includes("credentials") &&
    //   this.opts.sessionStrategy === "database"
    // ) {
    //   throw new Error("credentials provider must use jwt");
    // }
  }

  appendAuthSecretToEnv() {
    appendToFileIfTextNotExists(
      ".env.local",
      `\nAUTH_SECRET=secret`,
      "AUTH_SECRET"
    );
  }

  addSignOutPage() {
    renderTemplate({
      inputPath: "auth-processor/app/signout/page.tsx.hbs",
      outputPath: "app/signout/page.tsx",
    });
  }

  addDashboardSidebar() {
    renderTemplate({
      inputPath: "auth-processor/components/private/dashboard-sidebar.tsx.hbs",
      outputPath: "components/private/dashboard-sidebar.tsx",
      data: {
        stripeEnabled: this.opts.stripeEnabled,
      },
    });
  }

  addAuthConfig() {
    let importsCode = "";
    let providersCode = "";
    for (const provider of this.opts.authProviders) {
      const strategy = authStrategyMap[provider];
      importsCode += compileTemplate({
        inputPath: strategy.importTemplatePath,
        data: {},
      });
      importsCode += "\n";
      providersCode += compileTemplate({
        inputPath: strategy.authTemplatePath,
        data: {},
      });
      providersCode += "\n";
    }
    renderTemplate({
      inputPath: "auth-processor/lib/auth.ts.hbs",
      outputPath: "lib/auth.ts",
      data: {
        importsCode: importsCode,
        providersCode: providersCode,
        sessionStrategy: this.opts.sessionStrategy,
        pkStrategyImport: pkStrategyImportTemplates[this.opts.pkStrategy],
        pkKeyValTemplate: pkKeyValTemplates[this.opts.pkStrategy],
      },
    });
  }

  addAuthRouteHandler() {
    renderTemplate({
      inputPath: "auth-processor/app/api/auth/[...nextauth]/route.ts.hbs",
      outputPath: "app/api/auth/[...nextauth]/route.ts",
    });
  }

  // addAuthMiddleware() {
  //   renderTemplate({
  //     inputPath: "middleware.ts.hbs",
  //     outputPath: "middleware.ts",
  //     data: {},
  //   });
  // }

  appendSecretsToEnv() {
    for (const provider of this.opts.authProviders) {
      const strategy = authStrategyMap[provider];
      let envVars = compileTemplate({
        inputPath: strategy.envTemplatePath,
        data: {},
      });
      envVars = "\n" + envVars;
      if (!strategy.textToSearchInEnv) return;
      appendToFileIfTextNotExists(
        ".env.local",
        envVars,
        strategy.textToSearchInEnv
      );
    }
  }

  addPrivateLayout() {
    renderTemplate({
      inputPath: "auth-processor/app/(private)/layout.tsx.hbs",
      outputPath: "app/(private)/layout.tsx",
    });
  }

  addPrivateDashboard() {
    renderTemplate({
      inputPath: "auth-processor/app/(private)/dashboard/page.tsx.hbs",
      outputPath: "app/(private)/dashboard/page.tsx",
    });
  }

  addCustomSignInPage() {
    renderTemplate({
      inputPath: "auth-processor/app/signin/page.tsx.custom.hbs",
      outputPath: "app/signin/page.tsx",
      data: {
        providers: {
          google: this.opts.authProviders.includes("google"),
          github: this.opts.authProviders.includes("github"),
          credentials: this.opts.authProviders.includes("credentials"),
          postmark: this.opts.authProviders.includes("postmark"),
          nodemailer: this.opts.authProviders.includes("nodemailer"),
        },
      },
    });
  }

  addProfilePage() {
    renderTemplate({
      inputPath: "auth-processor/app/(private)/profile/page.tsx.hbs",
      outputPath: "app/(private)/profile/page.tsx",
    });
  }

  addSettingsPage() {
    renderTemplate({
      inputPath: "auth-processor/app/(private)/settings/page.tsx.hbs",
      outputPath: "app/(private)/settings/page.tsx",
    });
  }

  addAuthSchema() {
    const pkText =
      this.dbDialectStrategy.pkStrategyTemplates[this.opts.pkStrategy];
    const pkStrategyImport = pkStrategyImportTemplates[this.opts.pkStrategy];
    renderTemplate({
      inputPath: authDbDialectStrategy[this.opts.dbDialect].authSchemaTemplate,
      outputPath: "schema/users.ts",
      data: {
        pkText: pkText,
        pkStrategyImport: pkStrategyImport,
        createdAtTemplate: this.dbDialectStrategy.createdAtTemplate,
        updatedAtTemplate: this.dbDialectStrategy.updatedAtTemplate,
      },
    });
  }

  addAuthTrustHostToEnv() {
    appendToFileIfTextNotExists(
      ".env.local",
      "\nAUTH_TRUST_HOST=http://localhost:3000",
      "AUTH_TRUST_HOST"
    );
  }

  printCompletionMessage() {
    log.checklist("auth checklist");
    for (const provider of this.opts.authProviders) {
      const authStrategy = authStrategyMap[provider];
      authStrategy.printCompletionMessage();
    }
  }
}
