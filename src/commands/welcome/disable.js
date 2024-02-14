const {
  PermissionFlagsBits,
  EmbedBuilder,
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
      .setCustomId("welcome.disable-yes")
      .setStyle(ButtonStyle.Success)
      .setLabel("Yes"),
    new ButtonBuilder()
      .setCustomId("welcome.disable-no")
      .setStyle(ButtonStyle.Danger)
      .setLabel("No"),
  );

  interaction.editReply({
    embeds: [
      embed
        .setDescription(
          `**Are you sure you want to disable the welcome module?**`,
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
    if (int.customId === "welcome.disable-no") {
      return int.update({
        embeds: [
          embed
            .setDescription(
              `${emojify(false)} | **Canceled this process**\n- **Use /welcome disable to run this command again**`,
            )
            .setColor("Orange"),
        ],
        components: [],
      });
    }

    await int.deferUpdate();
    const data = await db.guilds.findOne({ Id: guild.id });

    if (data && data.welcome.enabled) {
      data.welcome.enabled = false;
      data.welcome.channel = null;
      await data.save();
      return int.editReply({
        embeds: [
          embed.setDescription(
            `${emojify(true)} | **Disabled the welcome module.**\n- **Thank you for using the bot!**`,
          ),
        ],
        components: [],
      });
    } else {
      return int.editReply({
        embeds: [
          embed
            .setDescription(
              `${emojify(false)} | **Welcome module is already disabled in this server.**\n- **Use /welcome enable to enable the welcome module.**`,
            )
            .setColor("DarkPurple"),
        ],
        components: [],
      });
    }
  });
};
