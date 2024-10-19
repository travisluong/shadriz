import { PkStrategy } from "./types";

export const pkStrategyImportTemplates: Record<PkStrategy, string> = {
  cuid2: `import { createId } from "@paralleldrive/cuid2";`,
  uuidv7: `import { uuidv7 } from "uuidv7";`,
  uuidv4: ``,
  nanoid: `import { nanoid } from "nanoid";`,
};

export const pkKeyValTemplates: Record<PkStrategy, string> = {
  cuid2: "id: createId(),",
  uuidv7: "id: uuidv7(),",
  uuidv4: "id: crypto.randomUUID(),",
  nanoid: "id: nanoid(),",
};

export const pkDependencies: Record<PkStrategy, string[]> = {
  cuid2: ["@paralleldrive/cuid2"],
  uuidv7: ["uuidv7"],
  uuidv4: [],
  nanoid: ["nanoid"],
};

export const pkFunctionInvoke: Record<PkStrategy, string> = {
  cuid2: "createId()",
  uuidv7: "uuidv7()",
  uuidv4: "crypto.randomUUID()",
  nanoid: "nanoid()",
};
