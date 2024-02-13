const { PermissionFlagsBits, EmbedBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { emojify, replaceAllMemberDescriptipn } = require("../../utils");

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  await interaction.deferReply();
  const member = await interaction.guild.members.fetch(interaction.user.id);
  const message = interaction.options.getString("message", true);
  const data = await client.db.guilds.findOne({ Id: interaction.guildId });

  if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setDescription(
        `${emojify(
          false,
        )} | **You don't have enough permissions to use this command.**`,
      )
      .setColor("Red")
      .setTimestamp();
    return interaction.editReply({ embeds: [embed] });
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setTimestamp();

  if (data && data.leaves.enabled) {
    data.leaves.message = message;
    await data.save();

    const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('collector-leaves.test')
      .setLabel('Test')
      .setStyle(ButtonStyle.Primary)
    )

    embed
      .setDescription(`${emojify(true)} | **Updated the leave message.**\n- **To view the updated message click the "Test" button.**`)
      .setColor("DarkPurple");

    interaction.editReply({ embeds: [embed], components: [row] });

    const collector = await interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id == interaction.user.id,
      componentType: ComponentType.Button
    });

    collector.on('collect', (int) => {
      const embed = new EmbedBuilder()
      .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
      .setDescription(replaceAllMemberDescriptipn(message, member))
      .setColor('Random')
      .setTimestamp();

      int.update({ embeds: [embed], components: [] });
      return collector.stop();
    });
  } else {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(
              false,
            )} | **Leave module is not emabled in this server. Use /leave enable**`,
          )
          .setColor("Orange"),
      ],
    });
  }
};
