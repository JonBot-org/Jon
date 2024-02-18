const {
  EmbedBuilder,
  PermissionFlagsBits,
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { emojify } = require("../../utils");
const db = require("../../mongo/index");

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  const { guild, user } = interaction;
  await interaction.deferReply();
  const member = await guild.members.fetch(user.id);
  const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setTimestamp();

  if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(false)} | **You don't have enough permissions to use this command.**`,
          )
          .setColor("Red"),
      ],
    });
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("leave.disable-yes")
      .setStyle(ButtonStyle.Success)
      .setLabel("Yes"),
    new ButtonBuilder()
      .setCustomId("leave.disable-no")
      .setStyle(ButtonStyle.Danger)
      .setLabel("No"),
  );

  interaction.editReply({
    embeds: [
      embed
        .setDescription(
          `**Are you sure you want to disable the leave module?**`,
        )
        .setColor("DarkPurple"),
    ],
    components: [row],
  });

  const collector = interaction.channel.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    componentType: ComponentType.Button,
  });

  collector.on("collect", async (int) => {
    if (int.customId === "leave.disable-no") {
      int.update({
        embeds: [
          embed
            .setDescription(
              `${emojify(false)} | **Canceled this process**\n- **Use /leave disable to run this command again.**`,
            )
            .setColor("DarkPurple"),
        ],
        components: [],
      });
      return collector.stop();
    }

    await int.deferUpdate();
    const data = await db.guilds.findOne({ Id: guild.id });

    if (data && data.leaves.enabled) {
      data.leaves.enabled = false;
      data.leaves.channel = null;
      await data.save();

      int.editReply({
        embeds: [
          embed
            .setDescription(
              `${emojify(true)} | **Disabled the leave module.**\n- **Thank you for using the bot!**`,
            )
            .setColor("DarkPurple"),
        ],
        components: [],
      });
      return collector.stop();
    } else {
      int.editReply({
        embeds: [
          embed
            .setDescription(
              `${emojify(false)} | **The leave module is already disabled in this server.**\n- **To enable use /leave enable**`,
            )
            .setColor("Orange"),
        ],
        components: [],
      });
      return collector.stop();
    }
  });

  collector.on("end", () => {
    return interaction.editReply({
      content: "This menu has **expired**, plesse re-run this command.",
      components: [],
    });
  });
};
