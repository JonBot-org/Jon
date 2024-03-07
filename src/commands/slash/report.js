const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("moderation: Report commands.")
    .setDMPermission(false)
    .addSubcommand((command) => {
      return command
        .setName("send")
        .setDescription("Send a report to moderators.");
    }),
};
