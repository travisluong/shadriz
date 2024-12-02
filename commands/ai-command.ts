import { input, select } from "@inquirer/prompts";
import { Command } from "commander";
import { getApiKey, getApiUrl } from "../lib/auth";
import { z } from "zod";
import { log } from "../lib/log";
import { ScaffoldProcessor } from "../processors/scaffold-processor";
import { loadShadrizzConfig } from "../lib/utils";
import { dialectStrategyFactory } from "../lib/strategy-factory";

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

aiCommand
  .command("scaffold")
  .description(
    "ai-assisted scaffolding wizard. describe your app. ai will suggest and generate a scaffold."
  )
  .action(async () => {
    const apiKey = getApiKey();
    const apiUrl = getApiUrl();
    const value = await input({ message: "What would you like to build?" });
    const res = await fetch(`${apiUrl}/api/ai/scaffold`, {
      headers: { "Api-Key": apiKey },
      body: JSON.stringify({ ideaText: value }),
      method: "POST",
    });
    if (!res.ok) {
      handleError(res);
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
          console.log(schemaText);

          const res = await fetchScaffoldAdjustment(apiKey, apiUrl, {
            adjustmentText,
            schemaText,
            threadId,
          });
          if (!res.ok) {
            handleError(res);
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

async function generateScaffold(schema: SchemaType) {
  for (const table of schema.data.tables) {
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
      authorizationLevel: "public",
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
        columnText += column.columnName + ":" + idDataType + "\n";
      } else {
        columnText += column.columnName + ":" + column.dataType + "\n";
      }
    }
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

function handleError(res: Response) {
  switch (res.status) {
    case 429:
      log.red("api quota exceeded");
      break;
    default:
      log.red("something went wrong");
      break;
  }
  process.exit(1);
}
