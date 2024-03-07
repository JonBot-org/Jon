const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const guilds = require("../../../../../db/guilds");
const { sleep, emojis } = require("../../../../../lib/functions");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (interaction) => {
  await interaction.deferReply({ fetchReply: true });
  const { guild, options, user } = interaction;

  const channel = options.getChannel("channel", true);
  const data = await guilds.findOne({ id: guild.id });

  if (data) {
    if (data.configurations.leave.enabled && channel.id != data.configurations.leave.channel) {
      const ConfirmEmbed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(`${emojis.loading} | Leave module is already enabled.\n» **Current Channel:** <#${data.configurations.leave.channel}>\n» **Do you want to update the channel?**`)
        .setColor("LuminousVividPink")
        .setTimestamp();

      const ConfirmButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("set.leave-yes")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("set.leave-no")
          .setLabel("No")
          .setStyle(ButtonStyle.Danger),
      );

      const message = await interaction.editReply({
        embeds: [ConfirmEmbed],
        components: [ConfirmButtons],
      });

      const collector = message.createMessageComponentCollector({
        filter: (int) => int.user.id === user.id,
        componentType: ComponentType.Button,
        maxComponents: 1,
      });

      collector.on("collect", async (int) => {
        if (int.customId === "set.leave-no") {
          const CancelEmbed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setDescription(`${emojis.success} | Stopped this process.`)
            .setColor("DarkPurple")
            .setTimestamp();
          int.update({ embeds: [CancelEmbed], components: [] });
          sleep(5000);
          await int.deleteReply().catch();
          return collector.stop();
        }

        await int.deferUpdate();
        data.configurations.leave.enabled = true;
        data.configurations.leave.channel = channel.id;
        await data.save();

        const CompleteEmbed = new EmbedBuilder()
          .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
          .setDescription(`${emojis.success} | Updated leave channel.\n» **Channel:** ${channel}`)
          .setColor("LuminousVividPink")
          .setTimestamp();

        int.editReply({ embeds: [CompleteEmbed], components: [] });
        return collector.stop();
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time") {
          interaction.editReply({ components: [] }).catch();
        }
      });

      return;
    }

    data.configurations.leave.enabled = true;
    data.configurations.leave.channel = channel.id;
    await data.save();
  } else {
    await guilds.create({
      id: guild.id,
      configurations: {
        leave: {
          enabled: true,
          channel: channel.id,
        },
      },
    });
  }

  const CompleteEmbed = new EmbedBuilder()
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
    .setDescription(`${emojis.success} | Enabled leave module.\n» **Channel:** ${channel}`)
    .setColor("LuminousVividPink")
    .setTimestamp();

  return interaction.editReply({ embeds: [CompleteEmbed] });
};
