import chalk from "chalk";

export const log = {
  bgBlue(str: string) {
    console.log(chalk.bgBlue(str));
  },

  bgRed(str: string) {
    console.log(chalk.bgRed(str));
  },

  bgGreen(str: string) {
    console.log(chalk.bgGreen(str));
  },

  bgYellow(str: string) {
    console.log(chalk.bgYellow(str));
  },

  log(str: string) {
    console.log(str);
  },

  cmd(str: string) {
    console.log(chalk.gray("$ ") + str);
  },

  dash(str: string) {
    console.log(chalk.gray("- ") + str);
  },

  reminder() {
    console.log(chalk.yellowBright("\n🔔 reminder:"));
  },

  point(str: string) {
    console.log("👉 " + chalk.white(str));
  },

  success(str: string) {
    console.log("\n✅ " + chalk.greenBright(str));
  },

  checklist(str: string) {
    console.log("\n📋 " + chalk.yellowBright(str));
  },
};
