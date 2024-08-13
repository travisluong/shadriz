import {
  ShadrizProcessor,
  PkStrategyProcessorOpts,
  PkStrategy,
} from "../lib/types";
import { installDependencies } from "../lib/utils";

export const pkStrategyImportTemplates: Record<PkStrategy, string> = {
  cuid2: `import { createId } from "@paralleldrive/cuid2;"`,
  uuidv7: `import { uuidv7 } from "uuidv7";`,
  uuidv4: ``,
  uuid: ``,
  nanoid: `import { nanoid } from "nanoid";`,
};

export class PkStrategyProcessor implements ShadrizProcessor {
  opts: PkStrategyProcessorOpts;
  dependencies: string[] = [];
  devDependencies: string[] = [];
  shadcnComponents: string[] = [];

  constructor(opts: PkStrategyProcessorOpts) {
    this.opts = opts;
  }

  async init(): Promise<void> {
    await this.install();
  }
  async install(): Promise<void> {
    if (!this.opts.install) {
      return;
    }

    switch (this.opts.pkStrategy) {
      case "cuid2":
        await installDependencies({
          dependencies: ["@paralleldrive/cuid2"],
          latest: this.opts.latest,
          packageManager: this.opts.packageManager,
        });
        break;
      case "uuidv7":
        await installDependencies({
          dependencies: ["uuidv7"],
          latest: this.opts.latest,
          packageManager: this.opts.packageManager,
        });
      case "nanoid":
        await installDependencies({
          dependencies: ["nanoid"],
          latest: this.opts.latest,
          packageManager: this.opts.packageManager,
        });
      default:
        break;
    }
  }
  async render(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
