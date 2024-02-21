const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const guilds = require("../../../../../db/guilds");
const { sleep } = require("../../../../../lib/functions");

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
    if (data.configurations.leave.enabled) {
      const confirmEmbed = new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.user.displayAvatarURL(),
        })
        .setDescription(
          `The leaves module is already enabled. \`channel:\` ${data.configurations.leave.channel ? `<#${data.configurations.leave.channel}>` : `I coudn't get the channel in time.`}\n- Do you want to change the leave channel?`,
        )
        .setColor("LuminousVividPink")
        .setTimestamp();

      const confirmRow = new ActionRowBuilder().addComponents(
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
        embeds: [confirmEmbed],
        components: [confirmRow],
      });

      const collector = message.createMessageComponentCollector({
        filter: (int) => int.user.id === interaction.user.id,
        componentType: ComponentType.Button,
        maxComponents: 1,
      });

      collector.on("collect", async (int) => {
        if (int.customId === "set.leave-no") {
          const cancelEmbed = new EmbedBuilder()
            .setAuthor({
              name: int.user.username,
              iconURL: int.user.displayAvatarURL(),
            })
            .setDescription(`Canceled the process.`)
            .setColor("DarkPurple")
            .setTimestamp();
          int.update({ embeds: [cancelEmbed], components: [] });
          sleep(5000)
            .then(() => int.deleteReply())
            .catch();
          return collector.stop("PS");
        }

        await int.deferUpdate();
        data.configurations.leave.enabled = true;
        data.configurations.leave.channel = channel.id;
        await data.save();

        const completeEmbed = new EmbedBuilder()
          .setAuthor({
            name: int.user.username,
            iconURL: int.user.displayAvatarURL(),
          })
          .setDescription(`Enabled leave module. \`channel:\` ${channel}`)
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

  const completeEmbed = new EmbedBuilder()
    .setAuthor({
      name: member.user.username,
      iconURL: member.user.displayAvatarURL(),
    })
    .setDescription(`Enabled leave module. \`channel:\` ${channel}`)
    .setColor("LuminousVividPink")
    .setTimestamp();

  return interaction.editReply({ embeds: [completeEmbed] });
};
