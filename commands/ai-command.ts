import { input, select } from "@inquirer/prompts";
import { Command } from "commander";
import { getApiKey, getApiUrl } from "../lib/auth";
import { z } from "zod";
import { log } from "../lib/log";
import { ScaffoldProcessor } from "../processors/scaffold-processor";
import {
  compileTemplate,
  getFilenamesFromFolder,
  loadShadrizzConfig,
  writeToFile,
} from "../lib/utils";
import { dialectStrategyFactory } from "../lib/strategy-factory";
import { caseFactory } from "../lib/case-utils";
import { AuthorizationLevel } from "../lib/types";
import chalk from "chalk";

export const aiCommand = new Command("ai");

const schema = z.object({
  data: z.object({
    tables: z
      .object({
        tableName: z.string(),
        columns: z
          .object({ columnName: z.string(), dataType: z.string() })
          .array(),
      })
      .array(),
  }),
  threadId: z.string().uuid(),
});

type SchemaType = z.infer<typeof schema>;

aiCommand
  .summary("ai commands")
  .description("ai-assisted scaffolding, ai dev tools, and more");

/**
 * 1. scaffold
 * 2. scaffold adjustment
 */

aiCommand
  .command("scaffold")
  .description(
    "ai-assisted scaffolding wizard. describe your app. ai will suggest and generate a scaffold."
  )
  .action(async () => {
    const apiKey = getApiKey();
    const apiUrl = getApiUrl();
    const shadrizzConfig = loadShadrizzConfig();
    const value = await input({ message: "What would you like to build?" });
    const res = await fetch(`${apiUrl}/api/ai/scaffold`, {
      headers: { "Api-Key": apiKey },
      body: JSON.stringify({
        ideaText: value,
        dbDialect: shadrizzConfig.dbDialect,
      }),
      method: "POST",
    });
    if (!res.ok) {
      await handleError(res);
    }
    let json = await res.json();

    while (true) {
      const validatedFields = schema.safeParse(json);
      if (!validatedFields.success) {
        throw new Error("data returned from api is invalid");
      }
      const threadId = validatedFields.data.threadId;
      renderTableSchema(validatedFields.data);
      const schemaText = getSchemaText(validatedFields.data);
      // ask if user wants to scaffold or adjust
      const value2 = await select({
        message:
          "Would you like to scaffold this schema or make changes to it?",
        choices: [
          {
            value: "make_adjustment",
            name: "Make adjustment",
            description: "Make adjustments to this schema",
          },
          {
            value: "generate_scaffold",
            name: "Generate scaffold",
            description: "Generate scaffold using this schema",
          },
          {
            value: "cancel",
            name: "Cancel",
            description: "Cancel this AI-assisted scaffold session",
          },
        ],
      });

      switch (value2) {
        case "make_adjustment":
          const adjustmentText = await input({
            message: "What changes would you like to make?",
          });
          log.blue("Making adjustment");
          const shadrizzConfig = loadShadrizzConfig();
          const res = await fetchScaffoldAdjustment(apiKey, apiUrl, {
            adjustmentText,
            schemaText,
            threadId,
            dbDialect: shadrizzConfig.dbDialect,
          });
          if (!res.ok) {
            await handleError(res);
          }
          json = await res.json();
          break;
        case "generate_scaffold":
          log.blue("Generating scaffold");
          await generateScaffold(validatedFields.data);
          break;
        case "cancel":
          log.log("AI-assisted scaffold canceled");
          process.exit(0);
          break;
        default:
          throw new Error("invalid answer");
      }
    }
  });

function checkIfTableAlreadyExists(
  existingSchemas: string[],
  tableName: string
) {
  const tableObj = caseFactory(tableName, { pluralize: true });
  for (const caseVar of Object.values(tableObj)) {
    for (const existingSchema of existingSchemas) {
      if (existingSchema === caseVar) {
        return true;
      }
    }
  }
  return false;
}

async function generateScaffold(schema: SchemaType) {
  const authorizationLevel: AuthorizationLevel = await select({
    message:
      "Which authorization level would you like to use for this scaffold?",
    choices: [
      {
        value: "admin",
        description: "Requires authentication and administrative privileges.",
      },
      {
        value: "private",
        description: "Requires user authentication.",
      },
      {
        value: "public",
        description: "Accessible by anyone without authentication.",
      },
    ],
  });

  const existingSchemas = getFilenamesFromFolder("schema").map(
    (filename) => filename.split(".")[0]
  );

  for (const table of schema.data.tables) {
    let answer = "override";
    if (checkIfTableAlreadyExists(existingSchemas, table.tableName)) {
      answer = await select({
        message: `${table.tableName} already exists.`,
        choices: [
          { value: "skip", name: `skip ${table.tableName}` },
          { value: "override", name: `override ${table.tableName}` },
        ],
      });
    }

    if (answer === "skip") {
      continue;
    }

    const columnArr = table.columns
      .filter(
        (col) => !["id", "created_at", "updated_at"].includes(col.columnName)
      )
      .map((col) => col.columnName + ":" + col.dataType);
    // generate scaffold
    const shadrizzConfig = loadShadrizzConfig();
    const processor = new ScaffoldProcessor({
      ...shadrizzConfig,
      table: table.tableName,
      columns: columnArr,
      authorizationLevel: authorizationLevel,
      enableCompletionMessage: true,
      enableSchemaGeneration: true,
    });
    processor.process();
  }
  log.success("AI-assisted scaffolding complete.");
  process.exit(0);
}

async function fetchScaffoldAdjustment(
  apiKey: string,
  apiUrl: string,
  body: {
    adjustmentText: string;
    schemaText: string;
    threadId: string;
    dbDialect: string;
  }
) {
  return await fetch(`${apiUrl}/api/ai/scaffold-adjustment`, {
    headers: { "Api-Key": apiKey },
    body: JSON.stringify(body),
    method: "POST",
  });
}

function renderTableSchema(schema: SchemaType) {
  const idDataType = getIdDataType();
  for (const table of schema.data.tables) {
    let columnText = "";
    for (const column of table.columns) {
      if (column.columnName === "id") {
        columnText += chalk.gray(column.columnName + ":" + idDataType + "\n");
      } else if (["created_at", "updated_at"].includes(column.columnName)) {
        // do not include timestamps from ai
      } else {
        columnText += column.columnName + ":" + column.dataType + "\n";
      }
    }
    const timestampDataType = getTimestampDataType();
    columnText += chalk.gray("created_at:" + timestampDataType + "\n");
    columnText += chalk.gray("updated_at:" + timestampDataType + "\n");
    log.yellow(table.tableName);
    log.log(columnText);
  }
}

function getIdDataType() {
  const shadrizzConfig = loadShadrizzConfig();
  const dbDialectStrategy = dialectStrategyFactory(shadrizzConfig.dbDialect);
  const pkStrategyDataTypes = dbDialectStrategy.pkStrategyDataTypes;
  const idDataType = pkStrategyDataTypes[shadrizzConfig.pkStrategy];
  return idDataType;
}

function getTimestampDataType() {
  const shadrizzConfig = loadShadrizzConfig();
  const dbDialectStrategy = dialectStrategyFactory(shadrizzConfig.dbDialect);
  const timestampDataType = dbDialectStrategy.timestampImport;
  return timestampDataType;
}

function getSchemaText(schema: SchemaType) {
  let text = "";
  for (const table of schema.data.tables) {
    text += table.tableName + "\n";
    for (const column of table.columns) {
      text += column.columnName + ":" + column.dataType + "\n";
    }
    text += "\n";
  }
  return text;
}

async function handleError(res: Response) {
  const json = await res.json();
  log.red(json.message);
  process.exit(1);
}

/**
 * 3. color palette
 */

aiCommand
  .command("color-palette")
  .description("have ai generate a color palette based on your description")
  .action(async () => {
    const apiKey = getApiKey();
    const apiUrl = getApiUrl();
    const value = await input({
      message: "Describe your ideal color palette.",
    });
    const cssText = compileTemplate({
      inputPath: "ai-templates/color-palette/globals.css.hbs",
    });
    log.blue("generating color palette...");
    const res = await fetch(`${apiUrl}/api/ai/color-palette`, {
      headers: { "Api-Key": apiKey },
      method: "POST",
      body: JSON.stringify({
        description: value,
        cssText,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      log.blue("after:");
      log.log(json.data.cssResult);
      log.log("");
      writeToFile("app/globals.css", json.data.cssResult);
      log.blue("summary:");
      log.log(json.data.summary);
      log.blue("reasoning:");
      log.log(json.data.reasoning);
    }
  });
