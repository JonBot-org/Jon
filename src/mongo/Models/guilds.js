const { default: mongoose } = require("mongoose");

const guilds = mongoose.model(
  "guilds",
  new mongoose.Schema({
    Id: String,

    leaves: {
      enabled: { type: Boolean, default: false },
      channel: { type: String },
      content: {
        type: String,
        default: "{member}, just left **{guild.name}.** Bye!",
      },
      color: String,
      description: {
        type: String,
        default: "{guild.nwme} now has **{guild.memberCount}** members.",
      },
    },

    welcome: {
      enabled: { type: Boolean, default: false },
      channel: { type: String },
      content: {
        type: String,
        default: "{member}, Welcome to **{guild.name}.** 👋",
      },
      color: String,
      description: {
        type: String,
        default: "{guild.name} now has **{guild.memberCount}** members.",
      },
    },
  }),
);

module.exports = {
  guilds,
};
