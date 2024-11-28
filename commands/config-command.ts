import path from "path";
import os from "os";
import fs from "fs";
import { Command } from "commander";
import { log } from "../lib/log";

export const configCommand = new Command("config").description("configuration");

const configDir = path.join(os.homedir(), ".shadrizz");
const configFile = path.join(configDir, "config.json");

if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

configCommand
  .command("set-api-key <key>")
  .description("set the api key")
  .action((key) => {
    const configData = { apiKey: key };
    fs.writeFileSync(configFile, JSON.stringify(configData, null, 2), "utf8");
    log.green("API key saved successfully.");
  });

configCommand
  .command("get-api-key")
  .description("get the stored api key")
  .action(() => {
    if (fs.existsSync(configFile)) {
      const configData = JSON.parse(fs.readFileSync(configFile, "utf8"));
      console.log("Stored API Key:", configData.apiKey);
    } else {
      console.log(
        "No API Key found. Use `config set-api-key <key>` to set one."
      );
    }
  });
