import {
  appendToFile,
  compileTemplate,
  logCmd,
  logGhost,
  logInfo,
  prependToFile,
  renderTemplate,
  spawnCommand,
} from "./utils";

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
    await this.installDependencies();
    await this.appendAuthSecretToEnv();
    this.addAuthConfig();
    this.addAuthRouteHandler();
    // this.addAuthMiddleware();
    this.appendSecretsToEnv();
    this.prependAdapterAccountTypeToSchema();
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
    logGhost("\n✅ auth setup success: " + this.opts.providers.join(", "));
    logGhost("\n👉 recommended next steps:");
    logInfo("\nrun migrations:");
    logCmd("npx drizzle-kit generate");
    logCmd("npx drizzle-kit migrate");
    if (this.opts.providers.includes("github")) {
      logInfo("setup github provider:");
      logGhost(
        "go to github > settings > developer settings > oauth apps > new oauth app"
      );
      logGhost("callback: http://localhost:3000/api/auth/callback/github");
      logGhost("update AUTH_GITHUB_ID in .env.local");
      logGhost("update AUTH_GITHUB_SECRET in .env.local");
    }
    if (this.opts.providers.includes("google")) {
      logInfo("setup google provider:");
      logGhost("go to console.cloud.google.com > new project");
      logGhost("search oauth > create oauth consent screen");
      logGhost("create oauth 2.0 client");
      logGhost("callback: http://localhost:3000/api/auth/callback/google");
      logGhost("update AUTH_GOOGLE_ID in .env.local");
      logGhost("update AUTH_GOOGLE_SECRET in .env.local");
    }
    if (this.opts.providers.includes("credentials")) {
      logInfo("create a test user for credentials provider:");
      logCmd("npx tsx scripts/create-user.ts foo@example.com password123");
    }
    logInfo("test login:");
    logCmd("npm run dev");
    logGhost("go to http://localhost:3000/api/auth/signin");
  }
}
