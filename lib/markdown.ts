import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import rehypePrism from "@mapbox/rehype-prism";
import fs from "fs";
import { join } from "path";

export async function parseMarkdown(content: string) {
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeFormat)
    // @ts-ignore
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(content);

  return processedContent.toString();
}

function getMarkdown() {
  const fullPath = join(__dirname, "..", "README.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return fileContents;
}

export async function getHtml() {
  const markdown = getMarkdown();
  const html = await parseMarkdown(markdown);
  return html;
}
