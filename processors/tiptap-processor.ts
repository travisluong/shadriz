import { log } from "../lib/log";
import { dialectStrategyFactory } from "../lib/strategy-factory";
import {
  DbDialectStrategy,
  ShadrizConfig,
  ShadrizProcessor,
} from "../lib/types";
import { renderTemplate } from "../lib/utils";

export class TiptapProcessor implements ShadrizProcessor {
  opts: ShadrizConfig;
  dependencies: string[] = [
    "@tiptap/core",
    "@tiptap/extension-link",
    "@tiptap/extension-text-align",
    "@tiptap/react",
    "@tiptap/starter-kit",
  ];
  devDependencies: string[] = [];
  shadcnComponents: string[] = [];
  dbDialectStrategy?: DbDialectStrategy | undefined;

  constructor(opts: ShadrizConfig) {
    this.dbDialectStrategy = dialectStrategyFactory(opts.dbDialect);
    this.opts = opts;
  }

  async init(): Promise<void> {
    await this.render();
  }
  async render(): Promise<void> {
    renderTemplate({
      inputPath: "tiptap-processor/components/tiptap-editor.tsx.hbs",
      outputPath: "components/tiptap-editor.tsx",
    });
    renderTemplate({
      inputPath: "tiptap-processor/styles/tiptap-editor.css.hbs",
      outputPath: "styles/tiptap-editor.css",
    });
  }
  printCompletionMessage() {
    log.checklist("tiptap editor checklist");
    log.task("you can now scaffold with a text_tiptap data type");
  }
}
