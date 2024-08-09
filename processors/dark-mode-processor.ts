import { DarkModeProcessorOpts, ShadrizProcessor } from "../lib/types";
import {
  addShadcnComponents,
  installDependencies,
  installDevDependencies,
  renderTemplate,
} from "../lib/utils";

export class DarkModeProcessor implements ShadrizProcessor {
  constructor(public opts: DarkModeProcessorOpts) {}

  dependencies = ["next-themes"];

  devDependencies = [];

  shadcnComponents: string[] = ["dropdown-menu"];

  async init() {
    await this.install();
    await this.render();
  }

  async install() {
    if (!this.opts.install) {
      return;
    }

    await installDependencies({
      dependencies: this.dependencies,
      packageManager: this.opts.packageManager,
      latest: this.opts.latest,
    });

    await installDevDependencies({
      devDependencies: this.devDependencies,
      packageManager: this.opts.packageManager,
      latest: this.opts.latest,
    });

    await addShadcnComponents({
      shadcnComponents: this.shadcnComponents,
      packageManager: this.opts.packageManager,
    });
  }

  async render() {
    await this.addThemeProvider();
    await this.addRootLayout();
    await this.addModeToggle();
  }

  async addThemeProvider() {
    renderTemplate({
      inputPath: "dark-mode-processor/components/theme-provider.tsx.hbs",
      outputPath: "components/theme-provider.tsx",
    });
  }

  async addRootLayout() {
    renderTemplate({
      inputPath: "dark-mode-processor/app/layout.tsx.hbs",
      outputPath: "app/layout.tsx",
    });
  }

  async addModeToggle() {
    renderTemplate({
      inputPath: "dark-mode-processor/components/mode-toggle.tsx.hbs",
      outputPath: "components/mode-toggle.tsx",
    });
  }
}
