import { test } from "vitest";
import { AuthProcessor } from "../processors/auth-processor";
import { SqliteDialectStrategy } from "../db-dialects/sqlite-dialect-strategy";

test("auth processor", () => {
  const a = new AuthProcessor({
    providers: ["google", "github", "credentials"],
    sessionStrategy: "jwt",
    install: false,
    packageManager: "npm",
    stripeEnabled: true,
    dbDialect: "sqlite",
    latest: true,
    pkStrategy: "uuidv4",
    dbDialectStrategy: new SqliteDialectStrategy(),
  });
  a.printCompletionMessage();
});
