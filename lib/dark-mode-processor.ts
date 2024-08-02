import { DarkModeProcessorOpts, ShadrizProcessor } from "./types";
import {
  addShadcnComponents,
  installDependencies,
  installDevDependencies,
  renderTemplate,
  spawnCommand,
} from "./utils";

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
      pnpm: this.opts.pnpm,
      latest: this.opts.latest,
    });

    await installDevDependencies({
      devDependencies: this.devDependencies,
      pnpm: this.opts.pnpm,
      latest: this.opts.latest,
    });

    await addShadcnComponents({
      shadcnComponents: this.shadcnComponents,
      pnpm: this.opts.pnpm,
    });
  }

  async render() {
    await this.addThemeProvider();
    await this.addRootLayout();
    await this.addModeToggle();
    await this.addHeader();
  }

  async addThemeProvider() {
    renderTemplate({
      inputPath: "components/theme-provider.tsx.hbs",
      outputPath: "components/theme-provider.tsx",
    });
  }

  async addRootLayout() {
    renderTemplate({
      inputPath: "app/layout.tsx.hbs",
      outputPath: "app/layout.tsx",
    });
  }

  async addModeToggle() {
    renderTemplate({
      inputPath: "components/mode-toggle.tsx.hbs",
      outputPath: "components/mode-toggle.tsx",
    });
  }

  async addHeader() {
    renderTemplate({
      inputPath: "components/header.tsx.hbs",
      outputPath: "components/header.tsx",
      data: { darkMode: true },
    });
  }
}
