const { log } = require("../../utils");

module.exports = {
  name: "unhandledRejection",
  type: "process",
  /**
   * @param {Error|any} error
   * @param {Promise} promise
   */
  run: async (error, promise) => {
    log("e", error + "\n", promise);
  },
};
