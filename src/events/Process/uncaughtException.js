const { log } = require("../../utils");

module.exports = {
  name: "uncaughtException",
  type: "process",
  /**
   * @param {Error} error
   * @param {String} origin
   */
  run: async (error, origin) => {
    log("e", origin + " " + error);
  },
};
