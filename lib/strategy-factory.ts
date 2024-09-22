import { DbDialect, ShadrizConfig } from "./types";
import { BetterSqlite3PackageStrategy } from "../db-packages/better-sqlite3-package-strategy";
import { Mysql2PackageStrategy } from "../db-packages/mysql2-package-strategy";
import { PgPackageStrategy } from "../db-packages/pg-package-strategy";
import { SqliteDialectStrategy } from "../db-dialects/sqlite-dialect-strategy";
import { MysqlDialectStrategy } from "../db-dialects/mysql-dialect-strategy";
import { PostgresqlDialectStrategy } from "../db-dialects/postgresql-dialect-strategy";

export function packageStrategyFactory(opts: ShadrizConfig) {
  switch (opts.dbPackage) {
    case "better-sqlite3":
      return new BetterSqlite3PackageStrategy(opts);
    case "mysql2":
      return new Mysql2PackageStrategy(opts);
    case "pg":
      return new PgPackageStrategy(opts);
    default:
      throw new Error("invalid db package: " + opts.dbPackage);
  }
}

export function dialectStrategyFactory(dialect: DbDialect) {
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
