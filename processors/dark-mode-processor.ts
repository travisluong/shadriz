import { log } from "../lib/log";
import { ShadrizConfig, ShadrizProcessor } from "../lib/types";
import {
  insertTextAfterIfNotExists,
  insertTextBeforeIfNotExists,
  prependToFileIfNotExists,
  renderTemplate,
} from "../lib/utils";

export class DarkModeProcessor implements ShadrizProcessor {
  constructor(public opts: ShadrizConfig) {}

  dependencies = ["next-themes"];

  devDependencies = [];

  shadcnComponents: string[] = ["dropdown-menu"];

  async init() {
    log.init("initializing dark mode...");
    await this.render();
  }

  async render() {
    await this.addThemeProvider();
    await this.addThemeProviderToRootLayout();
    await this.addModeToggle();
  }

  async addThemeProvider() {
    renderTemplate({
      inputPath: "dark-mode-processor/components/theme-provider.tsx.hbs",
      outputPath: "components/theme-provider.tsx",
    });
  }

  async addModeToggle() {
    renderTemplate({
      inputPath: "dark-mode-processor/components/mode-toggle.tsx.hbs",
      outputPath: "components/mode-toggle.tsx",
    });
  }

  async addThemeProviderToRootLayout() {
    prependToFileIfNotExists(
      "app/layout.tsx",
      `import { ThemeProvider } from "@/components/theme-provider";\n`
    );

    const code = `<ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >\n          `;

    insertTextBeforeIfNotExists("app/layout.tsx", "{children}", code);

    insertTextAfterIfNotExists(
      "app/layout.tsx",
      "{children}",
      "\n        </ ThemeProvider>\n"
    );

    insertTextAfterIfNotExists(
      "app/layout.tsx",
      "<html",
      " suppressHydrationWarning"
    );
  }

  printCompletionMessage() {}
}
