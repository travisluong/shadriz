import path from "path";
import fs from "fs";
import { marked } from "marked";

export function getMarkdown() {
  const fullPath = path.join(__dirname, "..", "README.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return fileContents;
}

// Override function
const renderer = {
  heading(text: string, depth: number) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");

    return `
            <h${depth}>
              <a name="${escapedText}" class="anchor" href="#${escapedText}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${depth}>`;
  },
};

export async function getReadme() {
  // @ts-ignore
  marked.use({ renderer });
  const md = getMarkdown();
  const html = await marked(md);
  return html;
}

let headings: string[] = [];

function walkTokens(token: any) {
  if (token.type === "heading") {
    const escapedText = token.text.toLowerCase().replace(/[^\w]+/g, "-");
    let className;
    switch (token.depth) {
      case 1:
        className = "level-1";
        break;
      case 2:
        className = "level-2";
        break;
      case 3:
        className = "level-3";
        break;
      default:
        break;
    }
    headings.push(
      `<li class="${className}"><a href="#${escapedText}">${token.text}</a></li>`
    );
  }
}

export async function getTableOfContents() {
  headings = [];
  marked.use({ walkTokens });
  const md = getMarkdown();
  const html = await marked(md);
  return headings;
}
