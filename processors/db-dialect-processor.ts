import { log } from "../lib/log";
import { ShadjsConfig, ShadjsProcessor } from "../lib/types";
import { renderTemplate, renderTemplateIfNotExists } from "../lib/utils";

export class DbDialectProcessor implements ShadjsProcessor {
  opts: ShadjsConfig;
  dependencies: string[] = [];
  devDependencies: string[] = [];
  shadcnComponents: string[] = [];
  constructor(opts: ShadjsConfig) {
    this.opts = opts;
  }

  async init(): Promise<void> {
    log.init("initializing db dialect...");
    await this.render();
  }

  async render(): Promise<void> {
    renderTemplate({
      inputPath: "db-dialect-processor/drizzle.config.ts.hbs",
      outputPath: "drizzle.config.ts",
      data: { dialect: this.opts.dbDialect },
    });

    renderTemplateIfNotExists({
      inputPath: `db-dialect-processor/lib/schema.ts.${this.opts.dbDialect}.hbs`,
      outputPath: "lib/schema.ts",
    });
  }

  printCompletionMessage() {}
}
