import { DbDialect, DbPackage } from "./types";
import { BetterSqlite3PackageStrategy } from "../db-packages/better-sqlite3-package-strategy";
import { Mysql2PackageStrategy } from "../db-packages/mysql2-package-strategy";
import { PgPackageStrategy } from "../db-packages/pg-package-strategy";
import { SqliteDialectStrategy } from "../db-dialects/sqlite-dialect-strategy";
import { MysqlDialectStrategy } from "../db-dialects/mysql-dialect-strategy";
import { PostgresqlDialectStrategy } from "../db-dialects/postgresql-dialect-strategy";

export function packageStrategyFactory({
  pnpm,
  dbPackage,
}: {
  pnpm: boolean;
  dbPackage: DbPackage;
}) {
  switch (dbPackage) {
    case "better-sqlite3":
      return new BetterSqlite3PackageStrategy({ pnpm: pnpm });
    case "mysql2":
      return new Mysql2PackageStrategy({ pnpm: pnpm });
    case "pg":
      return new PgPackageStrategy({ pnpm: pnpm });
    default:
      throw new Error("invalid db package: " + dbPackage);
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
