const { default: mongoose, Schema } = require("mongoose");

const config = mongoose.model(
  "config",
  new Schema({
    Id: String,
    server_logs: {
      enabled: { type: Boolean, default: false },
      channel: String,
    },

    mod_logs: {
      enabled: { type: Boolean, default: false },
      channel: String,
    },
  }),
);

module.exports = {
  config,
};