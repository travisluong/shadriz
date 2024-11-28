#!/usr/bin/env node

import { Command } from "commander";
import packageJson from "./package.json";
import { configCommand } from "./commands/config-command";
import { newCommand } from "./commands/new-command";
import { initCommand } from "./commands/init-command";
import { scaffoldCommand } from "./commands/scaffold-command";
import { addCommand } from "./commands/add-command";
import { aiCommand } from "./commands/ai-command";

const VERSION = packageJson["version"];

const program = new Command();

program
  .name("shadrizz")
  .description(
    "shadrizz - full stack framework next.js shadcn/ui and drizzle orm"
  )
  .version(VERSION);

program.addCommand(newCommand);
program.addCommand(initCommand);
program.addCommand(scaffoldCommand);
program.addCommand(addCommand);
program.addCommand(configCommand);
program.addCommand(aiCommand);

program.parse();
