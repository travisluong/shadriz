import Handlebars from "handlebars";
import path from "path";
import fs from "fs";
import { getHtml, getTableOfContents } from "../docs/lib/markdown";
import packageJson from "../package.json";

const { exec } = require("child_process");

Handlebars.registerPartial(
  "layout",
  fs.readFileSync(path.join(process.cwd(), "docs/templates/layout.hbs"), "utf8")
);

Handlebars.registerHelper("layout", function (options) {
  const layout = Handlebars.partials["layout"];
  const template = Handlebars.compile(layout, { noEscape: true });
  // @ts-ignore
  const content = options.fn(this); // Renders the inner content of the current template
  // @ts-ignore
  return template({ ...this, body: content });
});

async function main() {
  await renderDocs();
  await renderAi();
  renderJs();
  renderCss();
}

async function renderDocs() {
  const version = packageJson["version"];
  const docsHtml = await getHtml("docs.md");
  const toc = await getTableOfContents("docs.md");

  renderTemplate({
    inputPath: "docs.hbs",
    outputPath: "docs/dist/index.html",
    data: {
      docsHtml: docsHtml,
      toc: toc,
      version: version,
    },
  });
}

async function renderAi() {
  const version = packageJson["version"];
  const aiHtml = await getHtml("ai.md");
  const aiToc = await getTableOfContents("ai.md");

  renderTemplate({
    inputPath: "docs.hbs",
    outputPath: "docs/dist/ai.html",
    data: {
      docsHtml: aiHtml,
      toc: aiToc,
      version: version,
    },
  });
}

function renderJs() {
  renderTemplate({
    inputPath: "app.js",
    outputPath: "docs/dist/app.js",
  });
}

function renderCss() {
  exec(
    "npx tailwindcss -i ./docs/templates/style.css -o ./docs/dist/output.css",
    // @ts-ignore
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
}

export function renderTemplate({
  inputPath,
  outputPath,
  data,
}: {
  inputPath: string;
  outputPath: string;
  data?: any;
}) {
  const content = compileTemplate({ inputPath, data });
  const joinedOutputPath = path.join(process.cwd(), outputPath);
  const resolvedPath = path.resolve(joinedOutputPath);
  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(resolvedPath, content);
}

export function compileTemplate({
  inputPath,
  data,
}: {
  inputPath: string;
  data?: any;
}): string {
  const templatePath = path.join(process.cwd(), "docs", "templates", inputPath);
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const compiled = Handlebars.compile(templateContent, { noEscape: true });
  const content = compiled(data);
  return content;
}

main();
