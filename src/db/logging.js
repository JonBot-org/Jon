const { default: mongoose } = require("mongoose");

module.exports = mongoose.model(
  "logging",
  new mongoose.Schema({
    id: String,

    channel_config: {
      enabled: { type: String, default: false },
      cid: String,
    },

    message_config: {
      enabled: { type: String, default: false },
      cid: String,
    },
  }),
);
