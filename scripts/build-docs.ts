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
}

main();
