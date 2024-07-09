import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import Handlebars from "handlebars";

// only to be run during new command
export function copyTemplates(name: string) {
  const templatesToCopy = [
    ".env.local.hbs",
    "lib/config.ts.hbs",
    "components/ui/data-table.tsx.hbs",
    // "app/api/auth/[...nextauth]/route.ts.hbs",
    // "components/sign-in.ts.hbs",
    // "auth.ts.hbs",
  ];
  for (const filePath of templatesToCopy) {
    copyTemplate(name, filePath);
  }
}

export function renderTemplate({
  inputPath,
  outputPath,
  data,
}: {
  inputPath: string;
  outputPath: string;
  data: any;
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
  data: any;
}): string {
  const templatePath = path.join(__dirname, "..", "templates", inputPath);
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const compiled = Handlebars.compile(templateContent, { noEscape: true });
  const content = compiled(data);
  return content;
}

export function copyTemplate(name: string, filePath: string) {
  const templatePath = path.join(__dirname, "..", "templates", filePath);
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const arr = filePath.split(".");
  arr.pop();
  const outputFilePath = arr.join(".");
  const outputPath = path.join(process.cwd(), `${name}`, outputFilePath);
  const resolvedPath = path.resolve(outputPath);
  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(resolvedPath, templateContent);
}

export async function runCommand(command: string, args: string[]) {
  console.log(`Executing command: ${command} ${args.join(" ")}`);

  const child = spawn(command, args, { shell: true });

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
        reject(
          new Error(
            `Command ${command} ${args.join(" ")} exited with code ${code}`
          )
        );
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
  } catch (error) {
    console.error(error);
  }
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}
