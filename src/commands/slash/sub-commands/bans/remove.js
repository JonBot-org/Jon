const { EmbedBuilder } = require("discord.js");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports = async (interaction, client) => {
  const { options, member, guild } = interaction;

  const user = options.getUser("user", true);
  const reason = options.getString("reason") || "No Reason Provided.";

  if (!user) {
    const UserNotFoundEmbed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL(),
      })
      .setDescription(`I coudn't find a user with the ID provided.`)
      .setColor("LuminousVividPink")
      .setTimestamp();

    return interaction.reply({ embeds: [UserNotFoundEmbed], ephemeral: true });
  }

  try {
    await interaction.deferReply();
    const bans = await guild.bans.fetch().catch();

    if (!bans.find((value) => value.user.id === user.id)) {
      const UserNotBanned = new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.user.displayAvatarURL(),
        })
        .setDescription(`This user is not banned from this server.`)
        .setColor("Orange")
        .setTimestamp();

      return interaction.editReply({ embeds: [UserNotBanned] });
    }

    await guild.bans.remove(user, reason);

    const CompletedEmbed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL(),
      })
      .setDescription(
        `» Unbanned \`${user.username}\`\n   » **Target:** ${user}\n   » **Reason:** ${reason}\n   » **Moderator:** ${member}`,
      )
      .setColor("LuminousVividPink")
      .setTimestamp();

    interaction.editReply({ embeds: [CompletedEmbed] });
  } catch (error) {
    console.log(error);
  }
};
