module.exports = {
  name: "warning",
  type: "process",
  /**
   *
   * @param {Error} warning
   */
  run: (warning) => {
    console.log(`[PROCESS] ||`, warning);
  },
};
