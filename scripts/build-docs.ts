import Handlebars from "handlebars";
import path from "path";
import fs from "fs";
import { getReadme, getTableOfContents } from "../lib/markdown";
import packageJson from "../package.json";

async function main() {
  const readme = await getReadme();
  const toc = await getTableOfContents();
  const version = packageJson["version"];

  renderTemplate({
    inputPath: "index.html.hbs",
    outputPath: "docs/dist/index.html",
  });
  renderTemplate({
    inputPath: "docs.html.hbs",
    outputPath: "docs/dist/docs.html",
    data: {
      readme: readme,
      toc: toc,
      version: version,
    },
  });
  renderTemplate({
    inputPath: "style.css",
    outputPath: "docs/dist/style.css",
  });
  renderTemplate({
    inputPath: "app.js",
    outputPath: "docs/dist/app.js",
  });
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
  const templatePath = path.join(
    __dirname,
    "..",
    "docs",
    "templates",
    inputPath
  );
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const compiled = Handlebars.compile(templateContent, { noEscape: true });
  const content = compiled(data);
  return content;
}

main();
