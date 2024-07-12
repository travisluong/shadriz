import { test } from "vitest";
import { SqliteDialectStrategy } from "../db-dialects/sqlite-dialect-strategy";
import { PostgresqlDialectStrategy } from "../db-dialects/postgresql-dialect-strategy";
import { NewProjectProcessor } from "../lib/new-project-processor";
import { AuthProcessor } from "../lib/auth-processor";

test("new project", () => {
  const n = new NewProjectProcessor("demo");
  n.printCompletionMessage();
});

test("db sqlite", () => {
  const s = new SqliteDialectStrategy();
  s.printInitCompletionMessage();
});

test("db postgresql", () => {
  const s = new PostgresqlDialectStrategy();
  s.printInitCompletionMessage();
});

test("auth processor", () => {
  const a = new AuthProcessor({
    providers: ["google", "github", "credentials"],
  });
  a.printCompletionMessage();
});
