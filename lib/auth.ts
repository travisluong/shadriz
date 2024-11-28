import fs from "fs";
import path from "path";
import os from "os";

const configDir = path.join(os.homedir(), ".shadrizz");
const configFile = path.join(configDir, "config.json");

export function getApiKey() {
  if (fs.existsSync(configFile)) {
    const configData = JSON.parse(fs.readFileSync(configFile, "utf8"));
    return configData.apiKey;
  } else {
    console.log(
      "No API Key found. Register at https://www.shadrizz.com. Use `config set-api-key <key>` to set one."
    );
    process.exit(1);
  }
}
