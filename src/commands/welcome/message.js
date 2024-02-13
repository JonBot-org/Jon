const {
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const { emojify, replaceAllMemberDescriptipn } = require("../../utils");
const { guilds } = require("../../mongo/index");

/**
 * @param {Client} client
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  await interaction.deferReply();
  const member = await interaction.guild.members.fetch(interaction.user.id);
  let message = interaction.options.getString("message", true);
  const data = await guilds.findOne({ Id: interaction.guildId });
  const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setTimestamp();

  if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    embed
      .setDescription(
        `${emojify(false)} | **You don't have enough permissions to use this command.**`,
      )
      .setColor("Red");
    return interaction.editReply({ embeds: [embed] });
  }

  if (data && data.welcome.enabled) {
    data.welcome.message = message;
    await data.save();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("collector-replica")
        .setLabel("Test")
        .setStyle(ButtonStyle.Primary),
    );

    embed
      .setDescription(
        `${emojify(true)} | **Updated welcome message, to view the updated message click the "Test" button.**`,
      )
      .setColor("DarkPurple");

    interaction.editReply({ embeds: [embed], components: [row] });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      componentType: ComponentType.Button,
    });

    collector.on("collect", (i) => {
      if (i.customId === "collector-replica") {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: member.user.username,
            iconURL: member.displayAvatarURL(),
          })
          .setDescription(replaceAllMemberDescriptipn(message, member))
          .setColor("Random")
          .setTimestamp();

        i.update({ embeds: [embed], components: [] });
        return collector.stop();
      }
    });
  } else {
    embed
      .setDescription(
        `${emojify(false)} | **This server does not have welcome module enabled, use /welcome enable**`,
      )
      .setColor("Orange");
    return interaction.editReply({ embeds: [embed] });
  }
};
