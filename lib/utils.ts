import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import Handlebars from "handlebars";
import { log } from "./log";
import packageShadrizJson from "../package-shadriz.json";
import { PackageManager, ShadrizConfig } from "./types";
import { caseFactory } from "./case-utils";

export function renderTemplateIfNotExists({
  inputPath,
  outputPath,
  data,
}: {
  inputPath: string;
  outputPath: string;
  data?: any;
}) {
  const joinedOutputPath = path.join(process.cwd(), outputPath);
  if (fs.existsSync(joinedOutputPath)) {
    log.bgYellow("exists: " + outputPath);
    return;
  }
  renderTemplate({
    inputPath,
    outputPath,
    data,
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
  appendToFileIfTextNotExists(filePath, textToAppend, "DB_URL");
}

export function appendToFileIfTextNotExists(
  filePath: string,
  textToAppend: string,
  textToSearch: string
) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  if (fileContent.includes(textToSearch)) {
    log.bgRed(`${textToSearch} detected in ${filePath}. skipping append.`);
  } else {
    appendToFile(filePath, textToAppend);
  }
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
    const tableObj = caseFactory(table);
    code += `import * as ${tableObj.pluralCamelCase} from "@/schema/${tableObj.original}";\n`;
  }
  code += "\n";
  code += "export const schema = {\n";
  for (const table of tablenames) {
    const tableObj = caseFactory(table);
    code += `  ...${tableObj.pluralCamelCase},\n`;
  }
  code += "};\n";
  writeToFile(`lib/schema.ts`, code);
}

export function regenerateSchemaList(): void {
  const filenames = getFilenamesFromFolder("schema");
  const tablenames = filenames
    .map((filename) => filename.split(".")[0])
    .filter((table) => table !== "user")
    .filter((table) => table !== "stripe");
  renderTemplate({
    inputPath: "scaffold-processor/components/schema-list.tsx.hbs",
    outputPath: "components/schema-list.tsx",
    data: {
      tablenames: tablenames,
    },
  });
}

export async function installDependencies(opts: {
  dependencies: string[];
  packageManager: PackageManager;
  latest: boolean;
}) {
  for (const str of opts.dependencies) {
    const pinnedVersion =
      packageShadrizJson.dependencies[
        str as keyof typeof packageShadrizJson.dependencies
      ];
    if (!pinnedVersion) {
      throw new Error("pinned version not found for dependency " + str);
    }
    let version;
    if (pinnedVersion.includes("beta")) {
      // priority 1
      version = pinnedVersion;
    } else if (opts.latest) {
      // priority 2
      version = "latest";
    } else {
      // priority 3
      version = pinnedVersion;
    }
    if (opts.packageManager === "pnpm") {
      await spawnCommand(`pnpm add ${str}@${version}`);
    } else {
      await spawnCommand(`npm install ${str}@${version}`);
    }
  }
}

export async function installDevDependencies(opts: {
  devDependencies: string[];
  packageManager: PackageManager;
  latest: boolean;
}) {
  for (const str of opts.devDependencies) {
    const pinnedVersion =
      packageShadrizJson.devDependencies[
        str as keyof typeof packageShadrizJson.devDependencies
      ];
    if (!pinnedVersion) {
      throw new Error("pinned version not found for dev dependency " + str);
    }
    let version;
    if (pinnedVersion.includes("beta")) {
      // priority 1
      version = pinnedVersion;
    } else if (opts.latest) {
      // priority 2
      version = "latest";
    } else {
      // priority 3
      version = pinnedVersion;
    }
    if (opts.packageManager === "pnpm") {
      await spawnCommand(`pnpm add -D ${str}@${version}`);
    } else if (opts.packageManager === "npm") {
      await spawnCommand(`npm install -D ${str}@${version}`);
    }
  }
}

export async function addShadcnComponents(opts: {
  shadcnComponents: string[];
  packageManager: PackageManager;
}) {
  for (const component of opts.shadcnComponents) {
    if (opts.packageManager === "pnpm") {
      await spawnCommand(`pnpm dlx shadcn-ui@latest add -y -o ${component}`);
    } else if (opts.packageManager === "npm") {
      await spawnCommand(`npx shadcn-ui@latest add -y -o ${component}`);
    }
  }
}

export function loadShadrizConfig(): ShadrizConfig {
  const json = fs.readFileSync(
    path.join(process.cwd(), "shadriz.config.json"),
    "utf-8"
  );
  return JSON.parse(json);
}

export function completeShadrizConfig(
  partialConfig: Partial<ShadrizConfig>
): ShadrizConfig {
  const completeConfig: ShadrizConfig = {
    version: partialConfig.version ?? "",
    packageManager: partialConfig.packageManager ?? "npm",
    latest: partialConfig.latest ?? false,
    dbDialect: partialConfig.dbDialect ?? "sqlite",
    dbPackage: partialConfig.dbPackage ?? "better-sqlite3",
    pkStrategy: partialConfig.pkStrategy ?? "uuidv4",
    timestampsEnabled: partialConfig.timestampsEnabled ?? false,
    authSolution: partialConfig.authSolution ?? "none",
    authProviders: partialConfig.authProviders ?? [],
    adminEnabled: partialConfig.adminEnabled ?? false,
    stripeEnabled: partialConfig.stripeEnabled ?? false,
    sessionStrategy: partialConfig.sessionStrategy ?? "jwt",
    darkModeEnabled: partialConfig.darkModeEnabled ?? false,
  };
  return completeConfig;
}
