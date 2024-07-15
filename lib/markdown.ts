import path from "path";
import fs from "fs";
import { marked } from "marked";

export function getMarkdown() {
  const fullPath = path.join(__dirname, "..", "README.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return fileContents;
}

export function getReadme() {
  const md = getMarkdown();
  const html = marked(md);
  return html;
}
