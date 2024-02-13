const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const moment = require("moment");

/**
 * @param {Client} client
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  const user = interaction.options.getUser("target");

  const embed = new EmbedBuilder()
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
    .setDescription(
      `- **Name:** ${user.displayName}\n- **CreatedAt:** ${moment(user.createdAt).format("DD/MM/YY")}`,
    )
    .setColor("DarkPurple")
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("collector-guild_member.whois")
      .setLabel("Member information")
      .setStyle(ButtonStyle.Secondary),
  );

  interaction.reply({ embeds: [embed], components: [row] });

  const collector = interaction.channel.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    componentType: ComponentType.Button,
  });

  collector.on("collect", async (i) => {
    await i.deferUpdate();
    const member = await i.guild.members.fetch(user.id);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.displayAvatarURL(),
      })
      .setDescription(
        `- **Name:** ${member.displayName}\n- **CreatedAt:** ${moment(member.user.createdAt).format("DD/MM/YYYY")}\n- **JoinedAt:** ${moment(member.joinedAt).format("DD/MM/YYYY")}\n- **Roles:** ${member.roles.cache
          .filter((v) => v.id === i.guildId)
          .last(5)
          .map((v) => v.name)
          .join(", ")}`,
      )
      .setColor(member.displayHexColor ? member.displayHexColor : "DarkPurple")
      .setTimestamp();

    i.editReply({ embeds: [embed], components: [] });
    return collector.stop();
  });
};
