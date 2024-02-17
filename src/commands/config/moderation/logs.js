const {
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
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
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setTimestamp();

  if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(false)} | **You don't have the required permissions to use this command**`,
          )
          .setColor("Red"),
      ],
    });
  }

  const options = {
    enabled: interaction.options.getBoolean("enabled"),
    channel: interaction.options.getChannel("channel"),
  };

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("moderation.logs-yes")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("moderation.logging-no")
      .setLabel("No")
      .setStyle(ButtonStyle.Danger),
  );

  console.log(options.enabled);

  let message;
  if (options.enabled === true) {
    message = await interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `**Are you sure you want to set moderation logging channel as ${options.channel}?**`,
          )
          .setColor("DarkPurple"),
      ],
      components: [row],
    });
  } else {
    message = await interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `**Are you sure you want to disable moderation logging?**`,
          )
          .setColor("DarkPurple"),
      ],
      components: [row],
    });
  }

  message
    .awaitMessageComponent({
      filter: (i) => i.user.id === interaction.user.id,
      componentType: ComponentType.Button,
    })
    .then(
      async (int) => {
        if (int.customId === "moderation.logging-no") {
          return int.update({
            embeds: [
              embed.setDescription(
                `${emojify(true)} | **Canceled this process**`,
              ),
            ],
            components: [],
          });
        }

        await int.deferUpdate();
        const data = await db.config.findOne({ Id: int.guildId });

        if (data) {
          data.mod_logs.enabled = options.enabled;
          data.mod_logs.channel = options.enabled ? options.channel.id : null;
          await data.save();
        } else {
          await db.config.create({
            Id: int.guildId,
            mod_logs: {
              enabled: options.enabled,
              channel: options.enabled ? options.channel : null,
            },
          });
        }

        return int.editReply({
          embeds: [
            embed
              .setDescription(
                `${emojify(true)} | **${options.enabled ? `Succesfully saved settings.` : "Succesfully disabled moderation logging."}**\n\n- **Moderation logging:**\nStatus: ${enabled(options.enabled)}\nChannel: ${options.enabled ? options.channel : "None"}`,
              )
              .setColor("DarkPurple"),
          ],
          components: [],
        });
      },
      () => {
        return interaction.editReply({ components: [] });
      },
    );
};
