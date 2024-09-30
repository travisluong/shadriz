import { ShadrizConfig, ShadrizProcessor } from "./types";
import {
  addShadcnComponents,
  installDependencies,
  installDevDependencies,
} from "./utils";

export class DependencyInstaller {
  opts: ShadrizConfig;
  processors: ShadrizProcessor[];

  constructor(processors: ShadrizProcessor[], opts: ShadrizConfig) {
    this.processors = processors;
    this.opts = opts;
  }

  async install() {
    const dependencies = [];
    const devDependencies = [];
    const shadcnComponents = [];

    for (const processor of this.processors) {
      dependencies.push(...processor.dependencies);
      devDependencies.push(...processor.devDependencies);
      shadcnComponents.push(...processor.shadcnComponents);
    }

    await installDependencies({
      dependencies,
      packageManager: this.opts.packageManager,
      latest: this.opts.latest,
    });

    await installDevDependencies({
      devDependencies,
      packageManager: this.opts.packageManager,
      latest: this.opts.latest,
    });

    await addShadcnComponents({
      shadcnComponents,
      packageManager: this.opts.packageManager,
      latest: this.opts.latest,
    });
  }
}
