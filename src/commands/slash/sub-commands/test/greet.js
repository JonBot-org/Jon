const guilds = require("../../../../db/guilds");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports = async (interaction, client) => {
  await interaction.deferReply({ ephemeral: true });
  interaction.editReply("Testing...");

  const data = await guilds.findOne({ id: interaction.guildId });

  if (!data) {
    return interaction.editReply("No configurations found for this server.");
  }

  if (!data.configurations.greet.enabled) {
    return interaction.editReply("Greet module is disabled in this server.");
  }

  client.emit("guildMemberAdd", interaction.member);

  interaction.editReply("**Complete!**");
};
