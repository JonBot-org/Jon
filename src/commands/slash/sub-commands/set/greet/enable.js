const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const guilds = require("../../../../../db/guilds");
const { emojis, sleep } = require("../../../../../lib/functions");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (interaction) => {
  await interaction.deferReply({ fetchReply: true });
  const { guild, options, member } = interaction;

  const channel = options.getChannel("channel", true);
  const data = await guilds.findOne({ id: guild.id });

  if (data) {
    if (
      data.configurations.greet.enabled &&
      channel.id != data.configurations.greet.channel
    ) {
      const confirmEmbed = new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.user.displayAvatarURL(),
        })
        .setDescription(`${emojis.loading} | Greet module is already enabled.\n» **Current Channel:** <#${data.configurations.greet.channel}>\n» **Do you want to update the channel?**`)
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
            .setDescription(`${emojis.success} | Stopped this process.\n» **No settings were changed.**`)
            .setColor("LuminousVividPink")
            .setTimestamp();
          int.update({ components: [], embeds: [cancelEmbed] });
          sleep(5000);
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
          .setDescription(`${emojis.success} | Updated greet channel.\n» **Channel:** ${channel}`)
          .setColor("LuminousVividPink")
          .setTimestamp();

        int.editReply({ embeds: [completeEmbed], components: [] });
        return collector.stop("PS");
      });

      collector.on("end", (collected, reason) => {
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
    await guilds.create({
      id: guild.id,
      ownerId: guild.ownerId,
      configurations: {
        greet: {
          enabled: true,
          channel: channel.id,
        },
      },
    });
  }

  const completeEmbed = new EmbedBuilder()
    .setAuthor({
      name: member.user.username,
      iconURL: member.user.displayAvatarURL(),
    })
    .setDescription(`${emojis.success} | Enabled greet module.\n» **Channel:** ${channel}`)
    .setColor("LuminousVividPink")
    .setTimestamp();

  return interaction.editReply({ embeds: [completeEmbed] });
};
