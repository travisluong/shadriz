import { Command } from "commander";
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";

const program = new Command();

program
  .name("shadriz")
  .description("Full Stack Framework Next.js ShadCN/UI and Drizzle ORM")
  .version("0.0.1");

program
  .command("new")
  .description("Create a new project with latest dependencies")
  .argument("<name>", "name of project")
  .action(async (name, options) => {
    try {
      await runCommand(
        `npx create-next-app ${name} --ts --eslint --tailwind --app --no-src-dir --no-import-alias`,
        []
      );
      await runCommand(
        `cd ${name} && npm i drizzle-orm mysql2 --legacy-peer-deps && npm i -D drizzle-kit`,
        []
      );
      await runCommand(`cd ${name} && npm i dotenv uuidv7`, []);
      await runCommand(`cd ${name} && npm i @auth/drizzle-adapter`, []);
      copyTemplates(name);
    } catch (error) {
      console.error("Error running command:", error);
    }
  });

function copyTemplates(name: string) {
  const templatesToCopy = [
    ".env.local.hbs",
    "lib/db.ts.hbs",
    "lib/config.ts.hbs",
    "scripts/migrate.ts.hbs",
    "drizzle.config.ts.hbs",
    "lib/schema.ts.hbs",
  ];
  for (const filePath of templatesToCopy) {
    copyTemplate(name, filePath);
  }
}

function copyTemplate(name: string, filePath: string) {
  const templatePath = path.join(__dirname, "templates", filePath);
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const arr = filePath.split(".");
  arr.pop();
  const outputFilePath = arr.join(".");
  const outputPath = path.join(__dirname, `${name}`, outputFilePath);
  const resolvedPath = path.resolve(outputPath);
  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(resolvedPath, templateContent);
}

async function runCommand(command: string, args: string[]) {
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

program.parse();
