import { test } from "vitest";
import { NewProjectProcessor } from "../lib/new-project-processor";

test("override home page", () => {
  const options = { pnpm: false };
  const newProjectProcessor = new NewProjectProcessor("demo", options);
  newProjectProcessor.overrideHomePageWithShadrizPage();
});
