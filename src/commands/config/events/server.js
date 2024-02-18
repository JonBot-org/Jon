const {
  PermissionFlagsBits,
  EmbedBuilder,
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { emojify, enabled } = require("../../../utils");
const db = require("../../../mongo/index");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (interaction) => {
  const { member } = interaction;
  await interaction.deferReply({ fetchReply: true });
  const embed = new EmbedBuilder()
    .setAuthor({
      name: member.user.username,
      iconURL: member.user.displayAvatarURL(),
    })
    .setTimestamp();

  if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return interaction.editReply({
      embeds: [
        embed
          .setColor("Red")
          .setDescription(
            `${emojify(false)} | **You don't have enough permissions to use this command.**`,
          ),
      ],
    });
  }

  const options = {
    channel: interaction.options.getChannel("channel", true),
    enabled: interaction.options.getBoolean("enabled", true),
  };

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("config.events-server_yes")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("config.events-server_no")
      .setLabel("No")
      .setStyle(ButtonStyle.Danger),
  );

  const message = await interaction.editReply({
    components: [row],
    embeds: [
      embed
        .setDescription(
          `**Are you sure you want ${options.enabled ? `to log \`server\` events to ${options.channel}` : `to disable \`server\` events?`}**`,
        )
        .setColor("DarkPurple"),
    ],
  });

  const collector = message.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    componentType: ComponentType.Button,
  });

  collector.on("collect", async (int) => {
    if (int.customId === "config.events-server_no") {
      int.update({
        components: [],
        embeds: [
          embed
            .setDescription(`${emojify(true)} | **Canceled this process.**`)
            .setColor("DarkPurple"),
        ],
      });
    }

    await int.deferUpdate();
    const data = await db.config.findOne({ Id: int.guildId });

    if (data) {
      data.server_logs.enabled = options.enabled;
      data.server_logs.channel = options.enabled ? options.channel.id : null;
      await data.save();
    } else {
      await db.config.create({
        Id: int.guildId,
        server_logs: {
          enabled: options.enabled,
          channel: options.enabled ? options.channel : null,
        },
      });
    }

    int.editReply({
      embeds: [
        embed.setDescription(
          `${emojify(true)} | **${options.enabled ? `Succesfully saved events log settings.` : `Succesfully disabled events log.`}**\n\n**Events log: \`server\`**\nStatus: ${enabled(options.enabled)}\nChannel: ${options.channel}`,
        ),
      ],
      components: [],
    });
  });
};
