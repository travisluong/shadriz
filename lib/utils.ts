import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import Handlebars from "handlebars";
import { log } from "./log";

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
  log.bgGreen("added: " + outputPath);
}

export function compileTemplate({
  inputPath,
  data,
}: {
  inputPath: string;
  data?: any;
}): string {
  const templatePath = path.join(__dirname, "..", "templates", inputPath);
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const compiled = Handlebars.compile(templateContent, { noEscape: true });
  const content = compiled(data);
  return content;
}

export async function spawnCommand(command: string) {
  log.bgBlue("running: " + command);
  const child = spawn(command, [], { shell: true });

  child.stdout.on("data", (data) => {
    console.log(`${data.toString()}`);
  });

  child.stderr.on("data", (data) => {
    console.error(`${data.toString()}`);
  });

  return new Promise((resolve, reject) => {
    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(null);
      } else {
        reject(new Error(`Command ${command} exited with code ${code}`));
      }
    });
  });
}

export function appendDbUrl(url: string) {
  const filePath = ".env.local";
  const textToAppend = "DB_URL=" + url;
  appendToFile(filePath, textToAppend);
}

export function appendToFile(filePath: string, textToAppend: string) {
  try {
    const joinedFilePath = path.join(process.cwd(), filePath);
    fs.appendFileSync(joinedFilePath, textToAppend);
    log.bgYellow("modified: " + filePath);
  } catch (error) {
    console.error(error);
  }
}

export function prependToFile(filePath: string, textToPrepend: string) {
  try {
    const joinedFilePath = path.join(process.cwd(), filePath);
    const fileContent = fs.readFileSync(joinedFilePath, "utf-8");
    const updatedContent = textToPrepend + fileContent;
    fs.writeFileSync(joinedFilePath, updatedContent, "utf-8");
    log.bgYellow("modified: " + filePath);
  } catch (error: any) {
    console.error(
      `Error while prepending content to the file: ${error.message}`
    );
  }
}

export function writeToFile(filePath: string, text: string) {
  try {
    const joinedFilePath = path.join(process.cwd(), filePath);
    fs.writeFileSync(joinedFilePath, text, "utf-8");
    log.bgYellow("modified: " + filePath);
  } catch (error: any) {
    console.error(
      `Error while prepending content to the file: ${error.message}`
    );
  }
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export function getFilenamesFromFolder(folderPath: string): string[] {
  try {
    const filenames = fs.readdirSync(folderPath);
    return filenames.filter((file) => {
      const filePath = path.join(process.cwd(), folderPath, file);
      return fs.lstatSync(filePath).isFile();
    });
  } catch (error: any) {
    console.error(`Error reading folder: ${error.message}`);
    return [];
  }
}

export function regenerateSchemaIndex(): void {
  const filenames = getFilenamesFromFolder("schema");
  const tablenames = filenames.map((filename) => filename.split(".")[0]);
  let code = "";
  for (const table of tablenames) {
    code += `import { ${table} } from "@/schema/${table}";\n`;
  }
  code += "\n";
  code += "export const schema = {\n";
  for (const table of tablenames) {
    code += `  ${table},\n`;
  }
  code += "};\n";
  writeToFile(`lib/schema.ts`, code);
}
