const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const guilds = require("../../../../../db/guilds");
const logger = require("jon-lib").Logger;

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports = async (interaction, client) => {
  await interaction.deferReply({ fetchReply: true });
  const { guild, options, member } = interaction;

  const channel = options.getChannel("channel", true);
  const data = await guilds.findOne({ id: guild.id });

  if (data) {
    if (data.configurations.greet.enabled) {
      const confirmEmbed = new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.user.displayAvatarURL(),
        })
        .setDescription(
          `The greet module is aready enabled. \`channel:\` ${data.configurations.greet.channel ? `<#${data.configurations.greet.channel}>` : `I couldn’t get the channel in time.`}\nDo you want to change the greet channel?`,
        )
        .setColor("DarkOrange")
        .setTimestamp();

      const confirmRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("set.greet-yes")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("set.greet-no")
          .setLabel("No")
          .setStyle(ButtonStyle.Danger),
      );

      const message = await interaction.editReply({
        embeds: [confirmEmbed],
        components: [confirmRow],
      });

      const collector = message.createMessageComponentCollector({
        filter: (int) => int.user.id === interaction.user.id,
        componentType: ComponentType.Button,
        maxComponents: 1,
      });

      collector.on("collect", async (int) => {
        if (int.customId === "set.greet-no") {
          const cancelEmbed = new EmbedBuilder()
            .setAuthor({
              name: member.user.username,
              iconURL: member.user.displayAvatarURL(),
            })
            .setDescription(`Canceled this process.`)
            .setColor("LuminousVividPink")
            .setTimestamp();
          int.update({ components: [], embeds: [cancelEmbed] });
          await int.deleteReply().catch();
          return collector.stop("PS");
        }

        await int.deferUpdate();
        data.configurations.greet.enabled = true;
        data.configurations.greet.channel = channel.id;
        await data.save();
        const completeEmbed = new EmbedBuilder()
          .setAuthor({
            name: member.user.username,
            iconURL: member.user.displayAvatarURL(),
          })
          .setDescription(`Changed the greet channel. \`channel:\` ${channel}`)
          .setColor("LuminousVividPink")
          .setTimestamp();

        int.editReply({ embeds: [completeEmbed], components: [] });
        return collector.stop("PS");
      });

      collector.on("end", (collected, reason) => {
        if (reason === "PS") return;
        if (reason === "time") {
          interaction.editReply({ components: [] }).catch();
        }
      });

      return;
    }

    data.configurations.greet.enabled = true;
    data.configurations.greet.channel = channel.id;
    await data.save();
  } else {
    await guilds
      .create({
        id: guild.id,
        ownerId: guild.ownerId,
        configurations: {
          greet: {
            enabled: true,
            channel: channel.id,
          },
        },
      })
      .catch((_) => logger.prototype.error(".catch_set.enable", _));
  }

  const completeEmbed = new EmbedBuilder()
    .setAuthor({
      name: member.user.username,
      iconURL: member.user.displayAvatarURL(),
    })
    .setDescription(
      `Enabled greet module. \`channel:\` ${channel} (${channel.id})`,
    )
    .setColor("LuminousVividPink")
    .setTimestamp();

  return interaction.editReply({ embeds: [completeEmbed] });
};
