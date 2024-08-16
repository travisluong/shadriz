import { test } from "vitest";
import { StripeProcessor } from "../processors/stripe-processor";
import { dialectStrategyFactory } from "../lib/strategy-factory";

test("stripe completion message", () => {
  const sqliteStrategy = dialectStrategyFactory("sqlite");
  const p = new StripeProcessor({
    dbDialectStrategy: sqliteStrategy,
    install: false,
    dbDialect: "sqlite",
    latest: true,
    packageManager: "npm",
    pkStrategy: "uuidv4",
  });
  p.printCompletionMessage();
});
