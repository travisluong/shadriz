import { compileTemplate, renderTemplate, runCommand } from "./utils";

type Providers = "github" | "google" | "credentials";

interface AuthScaffoldOpts {
  providers: Providers[];
}

interface AuthStrategy {
  importTemplatePath: string;
  authTemplatePath: string;
}

interface AuthStrategyMap {
  github: AuthStrategy;
  google: AuthStrategy;
  credentials: AuthStrategy;
}

const authStrategyMap: AuthStrategyMap = {
  github: {
    importTemplatePath: "lib/auth.ts.github.imports.hbs",
    authTemplatePath: "lib/auth.ts.github.hbs",
  },
  google: {
    importTemplatePath: "lib/auth.ts.google.imports.hbs",
    authTemplatePath: "lib/auth.ts.google.hbs",
  },
  credentials: {
    importTemplatePath: "lib/auth.ts.credentials.imports.hbs",
    authTemplatePath: "lib/auth.ts.credentials.hbs",
  },
};

export class AuthScaffoldProcessor {
  constructor(public opts: AuthScaffoldOpts) {}

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
    this.addAuthMiddleware();
  }

  async installDependencies() {
    await runCommand("npm i @auth/drizzle-adapter next-auth@beta");
  }

  async appendAuthSecretToEnv() {
    await runCommand("npx auth secret");
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
      inputPath: "lib/auth.ts.hbs",
      outputPath: "lib/auth.ts",
      data: { importsCode: importsCode, providersCode: providersCode },
    });
  }

  addAuthRouteHandler() {
    renderTemplate({
      inputPath: "app/api/auth/[...nextauth]/route.ts.hbs",
      outputPath: "app/api/auth/[...nextauth]/route.ts",
      data: {},
    });
  }

  addAuthMiddleware() {
    renderTemplate({
      inputPath: "middleware.ts.hbs",
      outputPath: "middleware.ts",
      data: {},
    });
  }
}
