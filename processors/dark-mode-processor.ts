import { log } from "../lib/log";
import { ShadrizConfig, ShadrizProcessor } from "../lib/types";
import { renderTemplate } from "../lib/utils";

/**
 * previously only for dark mode.
 * now responsible for variety of root layout changes
 * - dark mode support
 * - toast
 */
export class DarkModeProcessor implements ShadrizProcessor {
  constructor(public opts: ShadrizConfig) {}

  dependencies = ["next-themes"];

  devDependencies = [];

  shadcnComponents: string[] = ["dropdown-menu", "toast"];

  async init() {
    log.init("initializing dark mode...");
    await this.render();
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

  printCompletionMessage() {}
}
