const guilds = require("../../../../db/guilds");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports = async (interaction, client) => {
  await interaction.deferReply({ ephemeral: true });
  const data = await guilds.findOne({ id: interaction.guildId });

  if (!data)
    return interaction.editReply({
      content: "This server does not have any configurations.",
    });

  if (!data.configurations.leave.enabled)
    return interaction.editReply({
      content: "This server has leave module disabled.",
    });

  client.emit("guildMemberRemove", interaction.member);

  interaction.editReply({ content: "**Complete!**" });
};
