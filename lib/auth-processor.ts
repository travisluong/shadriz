import {
  appendToFile,
  compileTemplate,
  renderTemplate,
  spawnCommand,
} from "./utils";
import { log } from "./log";
import { AuthProvider, SessionStrategy } from "./types";

interface AuthProcessorOpts {
  providers: AuthProvider[];
  pnpm: boolean;
  sessionStrategy: SessionStrategy;
  install: boolean;
}

interface AuthStrategy {
  importTemplatePath: string;
  authTemplatePath: string;
  envTemplatePath: string;
}

interface AuthStrategyMap {
  github: AuthStrategy;
  google: AuthStrategy;
  credentials: AuthStrategy;
  postmark: AuthStrategy;
}

const authStrategyMap: AuthStrategyMap = {
  github: {
    importTemplatePath: "auth/auth.ts.github.imports.hbs",
    authTemplatePath: "auth/auth.ts.github.hbs",
    envTemplatePath: "auth/auth.ts.github.env.hbs",
  },
  google: {
    importTemplatePath: "auth/auth.ts.google.imports.hbs",
    authTemplatePath: "auth/auth.ts.google.hbs",
    envTemplatePath: "auth/auth.ts.google.env.hbs",
  },
  credentials: {
    importTemplatePath: "auth/auth.ts.credentials.imports.hbs",
    authTemplatePath: "auth/auth.ts.credentials.hbs",
    envTemplatePath: "auth/auth.ts.credentials.env.hbs",
  },
  postmark: {
    importTemplatePath: "auth/auth.ts.postmark.imports.hbs",
    authTemplatePath: "auth/auth.ts.postmark.hbs",
    envTemplatePath: "auth/auth.ts.postmark.env.hbs",
  },
};

export class AuthProcessor {
  constructor(public opts: AuthProcessorOpts) {}

  async init() {
    this.validateOptions();
    await this.installDependencies();
    await this.appendAuthSecretToEnv();
    await this.addShadcnAvatar();
    this.addAuthConfig();
    this.addAuthRouteHandler();
    // this.addAuthMiddleware();
    this.appendSecretsToEnv();
    this.addPrivateLayout();
    this.addPrivateDashboard();
    this.addCustomSignInPage();
    this.addProfilePage();
    this.addSettingsPage();
  }

  validateOptions() {
    for (const provider of this.opts.providers) {
      if (!(provider in authStrategyMap)) {
        throw new Error("invalid provider: " + provider);
      }
    }

    if (!["jwt", "database"].includes(this.opts.sessionStrategy)) {
      throw new Error("invalid session strategy: " + this.opts.sessionStrategy);
    }

    if (
      this.opts.providers.includes("credentials") &&
      this.opts.sessionStrategy === "database"
    ) {
      throw new Error("credentials provider must use jwt");
    }
  }

  async installDependencies() {
    if (!this.opts.install) {
      return;
    }
    if (this.opts.pnpm) {
      await spawnCommand("pnpm add @auth/drizzle-adapter next-auth@beta");
      if (this.opts.providers.includes("credentials")) {
        await spawnCommand("pnpm add bcrypt");
        await spawnCommand("pnpm add -D @types/bcrypt");
      }
      return;
    }
    await spawnCommand("npm install @auth/drizzle-adapter next-auth@beta");
    if (this.opts.providers.includes("credentials")) {
      await spawnCommand("npm install bcrypt");
      await spawnCommand("npm install -D @types/bcrypt");
    }
  }

  async appendAuthSecretToEnv() {
    if (this.opts.pnpm) {
      await spawnCommand("pnpm dlx auth secret");
    } else {
      await spawnCommand("npx auth secret");
    }
  }

  addAuthConfig() {
    let importsCode = "";
    let providersCode = "";
    for (const provider of this.opts.providers) {
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
      inputPath: "auth/auth.ts.hbs",
      outputPath: "auth.ts",
      data: {
        importsCode: importsCode,
        providersCode: providersCode,
        sessionStrategy: this.opts.sessionStrategy,
      },
    });
  }

  addAuthRouteHandler() {
    renderTemplate({
      inputPath: "app/api/auth/[...nextauth]/route.ts.hbs",
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
    for (const provider of this.opts.providers) {
      const strategy = authStrategyMap[provider];
      let envVars = compileTemplate({
        inputPath: strategy.envTemplatePath,
        data: {},
      });
      envVars = "\n" + envVars;
      appendToFile(".env.local", envVars);
    }
  }

  addPrivateLayout() {
    renderTemplate({
      inputPath: "app/(private)/layout.tsx.hbs",
      outputPath: "app/(private)/layout.tsx",
    });
  }

  addPrivateDashboard() {
    renderTemplate({
      inputPath: "app/(private)/dashboard/page.tsx.hbs",
      outputPath: "app/(private)/dashboard/page.tsx",
    });
  }

  addCustomSignInPage() {
    renderTemplate({
      inputPath: "app/signin/page.tsx.custom.hbs",
      outputPath: "app/signin/page.tsx",
      data: {
        providers: {
          google: this.opts.providers.includes("google"),
          github: this.opts.providers.includes("github"),
          credentials: this.opts.providers.includes("credentials"),
          postmark: this.opts.providers.includes("postmark"),
        },
      },
    });
  }

  addProfilePage() {
    renderTemplate({
      inputPath: "app/(private)/profile/page.tsx.hbs",
      outputPath: "app/(private)/profile/page.tsx",
    });
  }

  addSettingsPage() {
    renderTemplate({
      inputPath: "app/(private)/settings/page.tsx.hbs",
      outputPath: "app/(private)/settings/page.tsx",
    });
  }

  async addShadcnAvatar() {
    if (!this.opts.install) {
      return;
    }
    if (this.opts.pnpm) {
      await spawnCommand("pnpm dlx shadcn-ui@latest add -y -o separator");
      await spawnCommand("pnpm dlx shadcn-ui@latest add -y -o avatar");
    } else {
      await spawnCommand("npx shadcn-ui@latest add -y -o separator");
      await spawnCommand("npx shadcn-ui@latest add -y -o avatar");
    }
  }

  printCompletionMessage() {
    log.success("auth setup success: " + this.opts.providers.join(", "));
    log.reminder();
    if (this.opts.providers.includes("github")) {
      log.white("\nsetup github provider:");
      log.dash(
        "go to github > settings > developer settings > oauth apps > new oauth app"
      );
      log.dash("callback: http://localhost:3000/api/auth/callback/github");
      log.dash("update AUTH_GITHUB_ID in .env.local");
      log.dash("update AUTH_GITHUB_SECRET in .env.local");
    }
    if (this.opts.providers.includes("google")) {
      log.white("\nsetup google provider:");
      log.dash(
        "go to console.cloud.google.com > new project > oauth consent screen + 2.0 client"
      );
      log.dash("callback: http://localhost:3000/api/auth/callback/google");
      log.dash("update AUTH_GOOGLE_ID in .env.local");
      log.dash("update AUTH_GOOGLE_SECRET in .env.local");
    }
    log.white("\nupdate DB_URL in .env.local");
    log.white("\nrun migrations:");
    log.cmd("npx drizzle-kit generate");
    log.cmd("npx drizzle-kit migrate");
    if (this.opts.providers.includes("credentials")) {
      log.white("\ncreate test user for credentials provider:");
      log.cmd("npx tsx scripts/create-user.ts shadriz@example.com password123");
    }
  }
}
