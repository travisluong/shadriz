import chalk from "chalk";

export const log = {
  blue(str: string) {
    console.log(chalk.blueBright(str));
  },

  red(str: string) {
    console.log(chalk.red(str));
  },

  green(str: string) {
    console.log(chalk.green(str));
  },

  yellow(str: string) {
    console.log(chalk.yellow(str));
  },

  gray(str: string) {
    console.log(chalk.gray(str));
  },

  log(str: string) {
    console.log(str);
  },

  success(str: string) {
    console.log(chalk.greenBright("✓ " + str));
  },

  init(str: string) {
    console.log(chalk.bold(str));
  },

  checklist(str: string) {
    console.log(chalk.bold.underline(str.toUpperCase()));
  },

  task(str: string) {
    console.log("□ " + str);
  },

  cmdtask(str: string) {
    console.log("□ run: " + str);
  },

  subtask(str: string) {
    console.log("  □ " + str);
  },

  cmdsubtask(str: string) {
    console.log("  □ run: " + str);
  },
};
