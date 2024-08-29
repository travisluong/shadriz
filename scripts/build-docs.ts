import { getReadme, getTableOfContents } from "../lib/markdown";
import { renderTemplate } from "../lib/utils";

async function main() {
  const readme = await getReadme();
  const toc = await getTableOfContents();
  renderTemplate({
    inputPath: "docs/index.html.hbs",
    outputPath: "docs/index.html",
    data: {
      readme: readme,
      toc: toc,
    },
  });
  renderTemplate({
    inputPath: "new-project-processor/styles/docs.css",
    outputPath: "docs/style.css",
  });
}

main();
