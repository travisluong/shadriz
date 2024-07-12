import chalk from "chalk";

export const log = {
  info(str: string) {
    console.log(chalk.bgBlue(str));
  },

  error(str: string) {
    console.log(chalk.bgRed(str));
  },

  success(str: string) {
    console.log(chalk.bgGreen(str));
  },

  warning(str: string) {
    console.log(chalk.bgYellow(str));
  },

  ghost(str: string) {
    console.log(chalk.white(str));
  },

  cmd(str: string) {
    console.log(chalk.gray("$ ") + chalk.white(str));
  },

  todo(str: string) {
    console.log(chalk.gray("- ") + chalk.white(str));
  },
};
