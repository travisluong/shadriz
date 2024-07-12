import {
  appendToFile,
  compileTemplate,
  prependToFile,
  renderTemplate,
  spawnCommand,
} from "./utils";
import { log } from "./log";

type Providers = "github" | "google" | "credentials";

interface AuthProcessorOpts {
  providers: Providers[];
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
};

export class AuthProcessor {
  constructor(public opts: AuthProcessorOpts) {}

  async init() {
    for (const provider of this.opts.providers) {
      if (!(provider in authStrategyMap)) {
        throw new Error("invalid provider: " + provider);
      }
    }
    // await this.installDependencies();
    // await this.appendAuthSecretToEnv();
    // this.addAuthConfig();
    // this.addAuthRouteHandler();
    // // this.addAuthMiddleware();
    // this.appendSecretsToEnv();
    // this.prependAdapterAccountTypeToSchema();
    await this.printCompletionMessage();
  }

  async installDependencies() {
    await spawnCommand("npm i @auth/drizzle-adapter next-auth@beta");
    if (this.opts.providers.includes("credentials")) {
      await spawnCommand("npm i bcrypt");
      await spawnCommand("npm i -D @types/bcrypt");
    }
  }

  async appendAuthSecretToEnv() {
    await spawnCommand("npx auth secret");
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
      providersCode += ",\n";
    }
    renderTemplate({
      inputPath: "auth/auth.ts.hbs",
      outputPath: "auth.ts",
      data: { importsCode: importsCode, providersCode: providersCode },
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

  prependAdapterAccountTypeToSchema() {
    prependToFile(
      "lib/schema.ts",
      'import type { AdapterAccountType } from "next-auth/adapters";\n'
    );
  }

  async printCompletionMessage() {
    log.white("\n✅ auth setup success: " + this.opts.providers.join(", "));
    log.white("\n👉 recommended next steps:");
    log.bgBlue("\nrun migrations:");
    log.cmd("npx drizzle-kit generate");
    log.cmd("npx drizzle-kit migrate");
    if (this.opts.providers.includes("github")) {
      log.bgBlue("setup github provider:");
      log.white(
        "go to github > settings > developer settings > oauth apps > new oauth app"
      );
      log.white("callback: http://localhost:3000/api/auth/callback/github");
      log.white("update AUTH_GITHUB_ID in .env.local");
      log.white("update AUTH_GITHUB_SECRET in .env.local");
    }
    if (this.opts.providers.includes("google")) {
      log.bgBlue("setup google provider:");
      log.white("go to console.cloud.google.com > new project");
      log.white("search oauth > create oauth consent screen");
      log.white("create oauth 2.0 client");
      log.white("callback: http://localhost:3000/api/auth/callback/google");
      log.white("update AUTH_GOOGLE_ID in .env.local");
      log.white("update AUTH_GOOGLE_SECRET in .env.local");
    }
    if (this.opts.providers.includes("credentials")) {
      log.bgBlue("create a test user for credentials provider:");
      log.cmd("npx tsx scripts/create-user.ts foo@example.com password123");
    }
    log.bgBlue("test login:");
    log.cmd("npm run dev");
    log.white("go to http://localhost:3000/api/auth/signin");
  }
}
