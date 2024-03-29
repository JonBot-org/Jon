const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embeds")
    .setDescription("Create, edit & delete embeds.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((input) => {
      return input
        .setName("create")
        .setDescription("Create an embed.")
        .addStringOption((option) => {
          return option
            .setName("name")
            .setDescription(
              "The name of the embed, this will be used to identify the embed.",
            )
            .setMaxLength(20)
            .setRequired(true);
        });
    })
    .addSubcommand((input) => {
      return input
        .setName("edit")
        .setDescription("Edit an embed.")
        .addStringOption((option) => {
          return option
            .setName("name")
            .setDescription("The name of the embed you want to edit.")
            .setRequired(true);
        });
    })
    .addSubcommand((input) => {
      return input
        .setName("delete")
        .setDescription("Delete an embed.")
        .addStringOption((option) => {
          return option
            .setName("name")
            .setDescription("The name of the embed you want to delete")
            .setRequired(true);
        });
    }),
};
