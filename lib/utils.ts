import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import Handlebars from "handlebars";
import chalk from "chalk";

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
  logSuccess("added: " + outputPath);
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
  logInfo("running: " + command);
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
    logWarning("modified: " + filePath);
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
    logWarning("modified: " + filePath);
  } catch (error) {
    console.error(
      `Error while prepending content to the file: ${error.message}`
    );
  }
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export function logInfo(str: string) {
  console.log(chalk.bgBlue(str));
}

export function logError(str: string) {
  console.log(chalk.bgRed(str));
}

export function logSuccess(str: string) {
  console.log(chalk.bgGreen(str));
}

export function logWarning(str: string) {
  console.log(chalk.bgYellow(str));
}

export function logGhost(str: string) {
  console.log(chalk.white(str));
}

export function logCmd(str: string) {
  console.log(chalk.gray("$ ") + chalk.white(str));
}
