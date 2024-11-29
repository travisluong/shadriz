import { input, select } from "@inquirer/prompts";
import { Command } from "commander";
import { getApiKey } from "../lib/auth";
import { z } from "zod";
import boxen from "boxen";
import { log } from "../lib/log";

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
    const value = await input({ message: "What would you like to build?" });
    const res = await fetch("http://localhost:3000/api/ai/scaffold", {
      headers: { "Api-Key": apiKey },
      body: JSON.stringify({ text: value }),
      method: "POST",
    });
    if (!res.ok) {
      log.red("something went wrong.");
      process.exit(1);
    }
    let json = await res.json();
    console.log(JSON.stringify(json));

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
          const adjustmentAnswer = await input({
            message: "What changes would you like to make?",
          });
          log.blue("Making adjustment");
          const res = await fetch(
            "http://localhost:3000/api/ai/scaffold-adjustment",
            {
              headers: { "Api-Key": apiKey },
              body: JSON.stringify({
                text: adjustmentAnswer,
                schemaText,
                threadId,
              }),
              method: "POST",
            }
          );
          if (!res.ok) {
            log.red("something went wrong.");
            process.exit(1);
          }
          json = await res.json();
          break;
        case "generate_scaffold":
          log.blue("Generating scaffold");
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

function renderTableSchema(schema: SchemaType) {
  for (const table of schema.data.tables) {
    let columnText = "";
    for (const column of table.columns) {
      columnText += column.columnName + ":" + column.dataType + "\n";
    }
    console.log(boxen(columnText, { title: table.tableName }));
  }
}

function getSchemaText(schema: SchemaType) {
  let text = "";
  for (const table of schema.data.tables) {
    text += table;
    for (const column of table.columns) {
      text += column.columnName + ":" + column.dataType + "\n";
    }
    text += "\n";
  }
  return text;
}
