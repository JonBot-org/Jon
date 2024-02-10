const { default: mongoose } = require("mongoose");

const guilds = mongoose.model(
  "guilds",
  new mongoose.Schema({
    Id: String,
    welcome: {
      enabled: { type: Boolean, default: false },
      channel: { type: String },
      message: {
        type: String,
        default: "**{member}, Welcome to {guild.name}**",
      },
    },
  }),
);

module.exports = {
  guilds,
};
