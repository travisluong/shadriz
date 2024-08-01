import { test } from "vitest";
import { StripeProcessor } from "../lib/stripe-processor";
import { dialectStrategyFactory } from "../lib/strategy-factory";

test("stripe completion message", () => {
  const sqliteStrategy = dialectStrategyFactory("sqlite");
  const p = new StripeProcessor({
    dbDialectStrategy: sqliteStrategy,
    install: false,
    pnpm: true,
  });
  p.printCompletionMessage();
});
