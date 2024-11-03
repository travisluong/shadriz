import { spawn, spawnSync, exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import Handlebars from "handlebars";
import { log } from "./log";
import packageShadrizJson from "../package-shadriz.json";
import { PackageManager, ShadrizConfig } from "./types";
import { caseFactory } from "./case-utils";
import { registerHandlebarsHelpers } from "./handlebars-helpers";

registerHandlebarsHelpers();

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
    log.gray("- " + outputPath + " - file exists");
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
  log.green("+ " + outputPath);
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

export function runCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    log.blue("> " + command);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        reject(error);
      } else {
        // verbose option
        // console.log(`${stdout}`);
        resolve();
      }
    });
  });
}

export async function spawnCommand(command: string): Promise<void> {
  log.blue("> " + command);
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
        resolve();
      } else {
        reject(new Error(`Command ${command} exited with code ${code}`));
      }
    });
  });
}

export function spawnSyncCommand(command: string) {
  log.blue("> " + command);
  const result = spawnSync(command, [], {
    stdio: "inherit", // Directly inherits stdio from the parent, enabling interaction
    shell: true, // Optional: Use the shell to interpret the command (useful for complex commands)
  });

  if (result.error) {
    console.error("Error executing command:", result.error);
  } else {
    console.log(`Process exited with code ${result.status}`);
  }
}

export function appendToEnvLocal(key: string, val: string) {
  appendToFileIfTextNotExists(".env.local", `${key}=${val}`, `${key}=`);
}

export function appendToFileIfTextNotExists(
  filePath: string,
  textToAppend: string,
  textToSearch: string
) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  if (fileContent.includes(textToSearch)) {
    log.gray(
      `- ${filePath} - text exists: ${textToSearch.trim().substring(0, 30)}...`
    );
  } else {
    appendToFile(filePath, "\n" + textToAppend);
  }
}

export function checkIfTextExistsInFile(
  filePath: string,
  textToSearch: string
) {
  const fileContent = fs.readFileSync(
    path.join(process.cwd(), filePath),
    "utf-8"
  );
  return fileContent.includes(textToSearch.trim());
}

export function appendToFile(filePath: string, textToAppend: string) {
  try {
    const joinedFilePath = path.join(process.cwd(), filePath);
    fs.appendFileSync(joinedFilePath, textToAppend);
    log.yellow(
      `M ${filePath} - text appended: ${textToAppend
        .trim()
        .substring(0, 30)}...`
    );
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
    log.yellow(
      "M " +
        filePath +
        ` - text prepended: ${textToPrepend.trim().substring(0, 30)}...`
    );
  } catch (error: any) {
    console.error(
      `Error while prepending content to the file: ${error.message}`
    );
  }
}

export function prependToFileIfNotExists(
  filePath: string,
  textToPrepend: string
) {
  if (checkIfTextExistsInFile(filePath, textToPrepend)) {
    log.gray(
      `- ${filePath} - text exists: ${textToPrepend.trim().substring(0, 30)}...`
    );
    return;
  }
  prependToFile(filePath, textToPrepend);
}

export function writeToFile(filePath: string, text: string) {
  try {
    const joinedFilePath = path.join(process.cwd(), filePath);
    fs.writeFileSync(joinedFilePath, text, "utf-8");
    log.green("+ " + filePath);
  } catch (error: any) {
    console.error(`Error while writing content to the file: ${error.message}`);
  }
}

export function insertTextBeforeIfNotExists(
  filePath: string,
  searchText: string,
  newText: string
) {
  if (checkIfTextExistsInFile(filePath, newText)) {
    log.gray(
      `- ${filePath} - text exists: ${newText.trim().substring(0, 30)}...`
    );
    return;
  }
  insertTextBefore(filePath, searchText, newText);
}

export function insertTextBefore(
  filePath: string,
  searchText: string,
  newText: string
) {
  // Read the file content
  const fileContent = fs.readFileSync(
    path.join(process.cwd(), filePath),
    "utf8"
  );

  // Find the position of the searchText
  const index = fileContent.indexOf(searchText);

  if (index === -1) {
    throw new Error(`Text "${searchText}" not found in the file.`);
  }

  // Insert the new text before the searchText
  const updatedContent =
    fileContent.slice(0, index) + newText + fileContent.slice(index);

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, "utf8");

  log.yellow(
    "M " + filePath + ` - text inserted: ${newText.trim().substring(0, 30)}...`
  );
}

export function insertTextAfter(
  filePath: string,
  searchText: string,
  newText: string
) {
  // Read the file content
  const fileContent = fs.readFileSync(
    path.join(process.cwd(), filePath),
    "utf8"
  );

  // Find the position of the searchText
  const index = fileContent.indexOf(searchText);

  if (index === -1) {
    throw new Error(`Text "${searchText}" not found in the file.`);
  }

  // Insert the new text after the searchText
  const updatedContent =
    fileContent.slice(0, index + searchText.length) +
    newText +
    fileContent.slice(index + searchText.length);

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, "utf8");

  log.yellow(
    "M " + filePath + ` - text inserted: ${newText.trim().substring(0, 30)}...`
  );
}

export function insertTextAfterIfNotExists(
  filePath: string,
  searchText: string,
  newText: string
) {
  // Read the file content
  const fileContent = fs.readFileSync(
    path.join(process.cwd(), filePath),
    "utf8"
  );

  const newTextIndex = fileContent.indexOf(newText);

  if (newTextIndex > -1) {
    log.gray(
      `- ${filePath} - text exists: ${newText.trim().substring(0, 30)}...`
    );
    return;
  }

  insertTextAfter(filePath, searchText, newText);
}

export function getFilenamesFromFolder(folderPath: string): string[] {
  try {
    const filenames = fs.readdirSync(folderPath);
    return filenames.filter((file) => {
      const filePath = path.join(process.cwd(), folderPath, file);
      return fs.lstatSync(filePath).isFile();
    });
  } catch (error: any) {
    return [];
  }
}

export async function installDependencies(opts: {
  dependencies: string[];
  packageManager: PackageManager;
  latest: boolean;
}) {
  const collectDependencies = [];
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
    collectDependencies.push(`${str}@${version}`);
  }
  if (collectDependencies.length === 0) {
    return;
  }

  const packageManagerRecords: Record<PackageManager, string> = {
    npm: `npm install ${collectDependencies.join(" ")} --force`,
    pnpm: `pnpm add ${collectDependencies.join(" ")}`,
    bun: `bun add ${collectDependencies.join(" ")}`,
  };

  const cmd = packageManagerRecords[opts.packageManager];

  await runCommand(cmd);
}

export async function installDevDependencies(opts: {
  devDependencies: string[];
  packageManager: PackageManager;
  latest: boolean;
}) {
  const collectDevDependencies = [];
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
    collectDevDependencies.push(`${str}@${version}`);
  }
  if (collectDevDependencies.length === 0) {
    return;
  }

  const packageManagerRecords: Record<PackageManager, string> = {
    npm: `npm install -D ${collectDevDependencies.join(" ")} --force`,
    pnpm: `pnpm add -D ${collectDevDependencies.join(" ")}`,
    bun: `bun add -D ${collectDevDependencies.join(" ")}`,
  };

  const cmd = packageManagerRecords[opts.packageManager];

  await runCommand(cmd);
}

export async function addShadcnComponents(opts: {
  shadcnComponents: string[];
  packageManager: PackageManager;
  latest: boolean;
}) {
  const pinnedVersion = packageShadrizJson.dependencies["shadcn"];
  if (!pinnedVersion) {
    throw new Error("pinned version not found for shadcn");
  }
  let version;
  if (opts.latest) {
    version = "latest";
  } else {
    version = pinnedVersion;
  }
  if (opts.shadcnComponents.length === 0) {
    return;
  }

  const packageManagerRecords: Record<PackageManager, string> = {
    npm: `npx shadcn@${version} add -y -o ${opts.shadcnComponents.join(" ")}`,
    pnpm: `pnpm dlx shadcn@${version} add -y -o ${opts.shadcnComponents.join(
      " "
    )}`,
    bun: `bunx shadcn@${version} add -y -o ${opts.shadcnComponents.join(" ")}`,
  };

  spawnSyncCommand(packageManagerRecords[opts.packageManager]);
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
    pkStrategy: partialConfig.pkStrategy ?? "cuid2",
    authEnabled: partialConfig.authSolution === "authjs",
    authSolution: partialConfig.authSolution ?? "none",
    authProviders: partialConfig.authProviders ?? ["credentials", "github"],
    adminEnabled: partialConfig.adminEnabled ?? false,
    install: partialConfig.install ?? true,
  };
  return completeConfig;
}

export function removeTextFromFile(
  filePath: string,
  targetString: string
): void {
  // Read the file content
  let fileContent = fs.readFileSync(path.join(process.cwd(), filePath), "utf8");

  // Replace the target multiline string with an empty string
  const updatedContent = fileContent.replace(targetString, "");

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, "utf8");
}

export function insertSchemaToSchemaIndex(table: string) {
  const tableObj = caseFactory(table);
  prependToFileIfNotExists(
    "lib/schema.ts",
    `import * as ${tableObj.pluralCamelCase} from "@/schema/${tableObj.pluralKebabCase}";\n`
  );
  insertTextAfterIfNotExists(
    "lib/schema.ts",
    "export const schema = {",
    `\n  ...${tableObj.pluralCamelCase},`
  );
}
