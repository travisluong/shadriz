import { test } from "vitest";
import { AuthProcessor } from "../processors/auth-processor";
import { AdminProcessor } from "../processors/admin-processor";
import { StripeProcessor } from "../processors/stripe-processor";
import { BetterSqlite3PackageStrategy } from "../db-packages/better-sqlite3-package-strategy";
import { PgPackageStrategy } from "../db-packages/pg-package-strategy";
import { ShadjsConfig } from "../lib/types";
import { Mysql2PackageStrategy } from "../db-packages/mysql2-package-strategy";

const shadjsConfig: ShadjsConfig = {
  authProviders: ["google", "github", "credentials", "nodemailer", "postmark"],
  install: false,
  packageManager: "npm",
  dbDialect: "sqlite",
  latest: true,
  pkStrategy: "uuidv4",
  adminEnabled: true,
  authEnabled: true,
  authSolution: "authjs",
  dbPackage: "better-sqlite3",
  version: "2",
};

test("better sqlite3 package strategy", () => {
  const s = new BetterSqlite3PackageStrategy(shadjsConfig);
  s.printCompletionMessage();
});

test("pg package strategy", () => {
  const s = new PgPackageStrategy(shadjsConfig);
  s.printCompletionMessage();
});

test("mysql2 package strategy", () => {
  const s = new Mysql2PackageStrategy(shadjsConfig);
  s.printCompletionMessage();
});

test("auth processor", () => {
  const a = new AuthProcessor(shadjsConfig);
  a.printCompletionMessage();
});

test("admin processor", () => {
  const a = new AdminProcessor(shadjsConfig);
  a.printCompletionMessage();
});

test("stripe processor", () => {
  const p = new StripeProcessor(shadjsConfig);
  p.printCompletionMessage();
});
