const {
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const guilds = require("../../../../../db/guilds");
const {
  set: { report },
} = require("../../../../../Strings/messages.json");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports = async (interaction, client) => {
  await interaction.deferReply({ fetchReply: true });
  const { options, member, guild } = interaction;

  const channel = options.getChannel("channel", true, ChannelType.GuildText);
  const data = await guilds.findOne({ id: guild.id });

  if (data) {
    if (
      data.configurations.report.enabled &&
      channel.id !== data.configurations.report.channel
    ) {
      const ConfirmEmbed = new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.user.displayAvatarURL(),
        })
        .setDescription(
          report["enable.confirm"].replace(
            "{channel}",
            `<#${data.configurations.report.channel}>`,
          ),
        )
        .setColor("LuminousVividPink")
        .setTimestamp();

      const ConfirmRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("set-report.yes")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("set-report.no")
          .setLabel("No")
          .setStyle(ButtonStyle.Danger),
      );

      const message = await interaction.editReply({
        embeds: [ConfirmEmbed],
        components: [ConfirmRow],
      });

      const collector = message.createMessageComponentCollector({
        filter: (int) => int.user.id === member.user.id,
        componentType: ComponentType.Button,
        maxComponents: 1,
      });

      collector.on("collect", async (int) => {
        if (int.customId === "set-report.no") {
          const CancelEmbed = new EmbedBuilder()
            .setAuthor({
              name: member.user.username,
              iconURL: member.user.displayAvatarURL(),
            })
            .setDescription(report["enable.confirm.cancel"])
            .setColor("LuminousVividPink")
            .setTimestamp();

          int.update({ embeds: [CancelEmbed], components: [] });
          setTimeout(function () {
            interaction.deleteReply().catch();
          }, 5000);
          return collector.stop(".");
        }

        await int.deferUpdate();

        data.configurations.report.channel = channel.id;
        await data.save();

        const CompleteEmbed = new EmbedBuilder()
          .setAuthor({
            name: member.user.username,
            iconURL: member.user.displayAvatarURL(),
          })
          .setDescription(
            report["enable.confirm.success"].replace("{channel}", `${channel}`),
          )
          .setColor("LuminousVividPink")
          .setTimestamp();

        int.editReply({ embeds: [CompleteEmbed], components: [] });
        return collector.stop(".");
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time") {
          interaction.editReply({ components: [] }).catch();
        }
      });

      return;
    }

    data.configurations.report.enabled = true;
    data.configurations.report.channel = channel.id;
    await data.save();
  } else {
    await guilds.create({
      id: guild.id,
      ownerId: guild.ownerId,
      configurations: {
        report: {
          enabled: true,
          channel: channel.id,
        },
      },
    });
  }

  const CompleteEmbed = new EmbedBuilder()
    .setAuthor({
      name: member.user.username,
      iconURL: member.user.displayAvatarURL(),
    })
    .setDescription(report["enable.success"].replace("{channel}", `${channel}`))
    .setColor("LuminousVividPink")
    .setTimestamp();

  return interaction.editReply({ embeds: [CompleteEmbed] });
};
