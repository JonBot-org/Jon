const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { loadSubcommands } = require("../../lib/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bans")
    .setDescription("moderation: Ban commands.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addSubcommand((command) => {
      return command
        .setName("add")
        .setDescription("Ban a member from this server.")
        .addUserOption((option) => {
          return option
            .setName("member")
            .setDescription("The member to ban.")
            .setRequired(true);
        })
        .addStringOption((option) => {
          return option
            .setName("history")
            .setDescription("Delete message history. e.g: 2d");
        })
        .addStringOption((option) => {
          return option
            .setName("reason")
            .setDescription("The reason for banning this member.");
        });
    })
    .addSubcommand((command) => {
      return command
        .setName("remove")
        .setDescription("Unban a member from this server.")
        .addUserOption((option) => {
          return option
            .setName("user")
            .setDescription("ID of the user to unban. e.g: 1125852865534107678")
            .setRequired(true);
        })
        .addStringOption((option) => {
          return option
            .setName("reason")
            .setDescription("The reason for unbanning this user.");
        });
    }),
  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */ execute: (interaction) => {
    loadSubcommands(interaction);
  },
};
