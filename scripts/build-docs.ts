import { getReadme, getTableOfContents } from "../lib/markdown";
import { renderTemplate } from "../lib/utils";
import packageJson from "../package.json";

async function main() {
  const readme = await getReadme();
  const toc = await getTableOfContents();
  const version = packageJson["version"];

  renderTemplate({
    inputPath: "docs/index.html.hbs",
    outputPath: "docs/index.html",
  });
  renderTemplate({
    inputPath: "docs/docs.html.hbs",
    outputPath: "docs/docs.html",
    data: {
      readme: readme,
      toc: toc,
      version: version,
    },
  });
  renderTemplate({
    inputPath: "docs/style.css",
    outputPath: "docs/style.css",
  });
  renderTemplate({
    inputPath: "docs/app.js",
    outputPath: "docs/app.js",
  });
}

main();
