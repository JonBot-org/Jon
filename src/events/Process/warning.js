const chalk = require("chalk");

module.exports = {
  name: "warning",
  type: "process",
  /**
   *
   * @param {Error} warning
   */
  run: (warning) => {
    console.log(chalk.red(`[PROCESS] ||`, warning));
  },
};
