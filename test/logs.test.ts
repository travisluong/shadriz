import { test } from "vitest";
import { AuthProcessor } from "../lib/auth-processor";

test("auth processor", () => {
  const a = new AuthProcessor({
    providers: ["google", "github", "credentials"],
    pnpm: false,
    sessionStrategy: "jwt",
    install: false,
  });
  a.printCompletionMessage();
});
