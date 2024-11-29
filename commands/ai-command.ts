import { input } from "@inquirer/prompts";
import { Command } from "commander";
import { getApiKey } from "../lib/auth";
import { z } from "zod";
import boxen from "boxen";

export const aiCommand = new Command("ai");

const tablesSchema = z.object({
  tables: z
    .object({
      tableName: z.string(),
      columns: z
        .object({ columnName: z.string(), dataType: z.string() })
        .array(),
    })
    .array(),
});

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
      body: JSON.stringify({ idea: value }),
      method: "POST",
    });
    const json = await res.json();
    const validatedFields = tablesSchema.safeParse(json.result);
    if (!validatedFields.success) {
      throw new Error("data returned from api is invalid");
    }
    for (const table of validatedFields.data?.tables) {
      let columnText = "";
      for (const column of table.columns) {
        columnText += column.columnName + ":" + column.dataType + "\n";
      }
      console.log(boxen(columnText, { title: table.tableName }));
    }
  });
