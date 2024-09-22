import { ShadrizProcessor, ShadrizConfig, PkStrategy } from "../lib/types";
import { installDependencies } from "../lib/utils";

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

const pkDependencies: Record<PkStrategy, string[]> = {
  cuid2: ["@paralleldrive/cuid2"],
  uuidv7: ["uuidv7"],
  uuidv4: [],
  nanoid: ["nanoid"],
};

export class PkStrategyProcessor implements ShadrizProcessor {
  opts: ShadrizConfig;
  dependencies: string[] = [];
  devDependencies: string[] = [];
  shadcnComponents: string[] = [];

  constructor(opts: ShadrizConfig) {
    this.opts = opts;
  }

  async init(): Promise<void> {
    await this.install();
  }

  async install(): Promise<void> {
    if (!this.opts.install) {
      return;
    }

    const pkDeps = pkDependencies[this.opts.pkStrategy];

    await installDependencies({
      dependencies: pkDeps,
      latest: this.opts.latest,
      packageManager: this.opts.packageManager,
    });
  }
  async render(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
