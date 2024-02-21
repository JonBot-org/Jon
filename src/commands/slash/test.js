const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { loadSubcommands } = require("../../lib/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test modules.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((command) => {
      return command.setName("greet").setDescription("Test the greet module.");
    }),
  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   * @param {import('discord.js').Client} client
   */ execute: (interaction, client) => {
    loadSubcommands(interaction);
  },
};
