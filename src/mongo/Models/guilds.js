const { default: mongoose } = require("mongoose");

const guilds = mongoose.model(
  "guilds",
  new mongoose.Schema({
    Id: String,

    leaves: {
      enabled: { type: Boolean, default: false },
      channel: { type: String },
      message: String,
    },

    welcome: {
      enabled: { type: Boolean, default: false },
      channel: { type: String },
      message: String,
    },
  }),
);

module.exports = {
  guilds,
};
