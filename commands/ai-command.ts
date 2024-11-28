import { input } from "@inquirer/prompts";
import { Command } from "commander";
import { getApiKey } from "../lib/auth";

export const aiCommand = new Command("ai");

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
    });
    const json = await res.json();
    console.log(json);
  });
