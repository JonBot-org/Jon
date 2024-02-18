const { log } = require("../../utils");

module.exports = {
  name: "warning",
  type: "process",
  /**
   *
   * @param {Error} warning
   */
  run: (warning) => {
    log("w", warning);
  },
};
