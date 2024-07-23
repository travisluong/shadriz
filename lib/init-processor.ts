import { log } from "./log";
import {
  DbDialect,
  InitProcessorOpts,
  AuthProvider,
  SessionStrategy,
} from "./types";
import { regenerateSchemaIndex, renderTemplate, spawnCommand } from "./utils";
import { getReadme } from "./markdown";
import { NewProjectProcessor } from "./new-project-processor";
import { BetterSqlite3PackageStrategy } from "../db-packages/better-sqlite3-package-strategy";
import { Mysql2PackageStrategy } from "../db-packages/mysql2-package-strategy";
import { PgPackageStrategy } from "../db-packages/pg-package-strategy";
import { SqliteDialectStrategy } from "../db-dialects/sqlite-dialect-strategy";
import { MysqlDialectStrategy } from "../db-dialects/mysql-dialect-strategy";
import { PostgresqlDialectStrategy } from "../db-dialects/postgresql-dialect-strategy";
import { AuthProcessor } from "./auth-processor";

export class InitProcessor {
  opts: InitProcessorOpts;

  constructor(opts: InitProcessorOpts) {
    this.opts = opts;
  }

  async init() {
    // new project processor
    const newProjectProcessor = new NewProjectProcessor({
      pnpm: this.opts.pnpm,
    });
    await newProjectProcessor.init();

    // package strategy pocessor
    const packageStrategyProcessor = this.packageStrategyFactory();

    // dialect strategy processor
    const dialectStrategyProcessor = this.dialectStrategyFactory(
      packageStrategyProcessor.dialect
    );

    await packageStrategyProcessor.init();
    dialectStrategyProcessor.init();

    // auth processor
    if (this.opts.authEnabled) {
      const authProcessor = new AuthProcessor({
        pnpm: this.opts.pnpm,
        providers: this.opts.authProviders as AuthProvider[],
        sessionStrategy: this.opts.authStrategy as SessionStrategy,
      });

      await authProcessor.init();
      dialectStrategyProcessor.addAuthSchema();
      dialectStrategyProcessor.copyCreateUserScript();
      regenerateSchemaIndex();
      authProcessor.printCompletionMessage();
    } else {
      regenerateSchemaIndex();
    }
  }

  packageStrategyFactory() {
    switch (this.opts.dbPackage) {
      case "better-sqlite3":
        return new BetterSqlite3PackageStrategy({ pnpm: this.opts.pnpm });
      case "mysql2":
        return new Mysql2PackageStrategy({ pnpm: this.opts.pnpm });
      case "pg":
        return new PgPackageStrategy({ pnpm: this.opts.pnpm });
      default:
        throw new Error("invalid db package: " + this.opts.dbPackage);
    }
  }

  dialectStrategyFactory(dialect: DbDialect) {
    switch (dialect) {
      case "sqlite":
        return new SqliteDialectStrategy();
      case "mysql":
        return new MysqlDialectStrategy();
      case "postgresql":
        return new PostgresqlDialectStrategy();
      default:
        throw new Error("invalid dialect: " + dialect);
    }
  }
}
