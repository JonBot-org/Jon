const { default: mongoose } = require("mongoose");

module.exports = mongoose.model(
  "guild",
  new mongoose.Schema({
    guildId: String,
  }),
  "guilds",
);
