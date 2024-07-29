import { DarkModeProcessorOpts } from "./types";
import { renderTemplate, spawnCommand } from "./utils";

export class DarkModeProcessor {
  constructor(public opts: DarkModeProcessorOpts) {}

  async init() {
    await this.installNextThemes();
    await this.installDropdownMenu();
    await this.addThemeProvider();
    await this.addRootLayout();
    await this.addModeToggle();
    await this.addHeader();
  }

  async installNextThemes() {
    if (this.opts.pnpm) {
      await spawnCommand(`pnpm add next-themes`);
    } else {
      await spawnCommand(`npm install next-themes`);
    }
  }

  async installDropdownMenu() {
    if (this.opts.pnpm) {
      await spawnCommand(`pnpm dlx shadcn-ui@latest add -y -o dropdown-menu`);
    } else {
      await spawnCommand(`npx shadcn-ui@latest add -y -o dropdown-menu`);
    }
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
