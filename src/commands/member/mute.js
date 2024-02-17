const {
  EmbedBuilder,
  PermissionFlagsBits,
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { emojify, createDisabledButton } = require("../../utils");
const ms = require("pretty-ms");
const timeString = require("convert-time-string").convertTimeString;

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  const { options, guild, member } = interaction;
  await interaction.deferReply({ fetchReply: true });
  const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setTimestamp();

  if (member && !member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(false)} | **You don't have enough permissions to use this command**`,
          )
          .setColor("Red"),
      ],
    });
  }

  interaction.editReply({
    embeds: [
      embed
        .setDescription(`**Checking if i can moderate this member.**`)
        .setColor("DarkPurple"),
    ],
  });

  const op = {
    member: options.getMember("member", true),
    duration: options.getString("duration")
      ? options.getString("duration")
      : null,
    reason: options.getString("reason"),
  };

  if (op.duration && !timeString(op.duration)) {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(false)} | **\`duration\` option is not formatted correctly**\n\n**How to format the duration?**\n- [day]**d** [hour]**h** [minutes]**m**\n- **e.g:** 5d 1h 30m`,
          )
          .setColor("Red"),
      ],
    });
  }

  if (guild.ownerId === op.member.id) {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(false)} | **I can't moderate the guild owner.**`,
          )
          .setColor("Red"),
      ],
    });
  }

  if (client.user.id === op.member.id) {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(`${emojify(false)} | **I can't moderate myself.**`)
          .setColor("Red"),
      ],
    });
  }

  if (!op.member.moderatable) {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(false)} | **I can't moderate this member.**`,
          )
          .setColor("Red"),
      ],
    });
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("member.mute-yes")
      .setStyle(ButtonStyle.Success)
      .setLabel("Yes"),
    new ButtonBuilder()
      .setCustomId("member.mute-no")
      .setStyle(ButtonStyle.Danger)
      .setLabel("No"),
  );

  const message = await interaction.editReply({
    embeds: [
      embed
        .setDescription(
          `${emojify(true)} | **All checks have been completed.**\n- **Are you sure you want to continue to ${op.duration ? `timeout ${op.member} for ${ms(timeString(op.duration, { compact: false }))}` : "remove the timeout"}?**`,
        )
        .setColor("DarkPurple"),
    ],
    components: [row],
  });

  const collector = message.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    componentType: ComponentType.Button,
  });

  collector.on("collect", async (int) => {
    if (int.customId === "member.mute-no") {
      int.update({
        embeds: [
          embed
            .setDescription(`${emojify(false)} | **Canceled this process.**`)
            .setColor("DarkPurple"),
        ],
        components: [],
      });
      return collector.stop();
    }

    await int.deferUpdate();

    try {
      if (!op.duration) {
        await op.member.timeout(null, op.reason);
        int.editReply({
          embeds: [
            embed
              .setDescription(
                `${emojify(true)} | **Removed timeout from ${op.member}** | ${op.reason ? op.reason : "No reason provided."}`,
              )
              .setColor("DarkPurple"),
          ],
          components: [],
        });
        return collector.stop();
      }

      await op.member
        .send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
              .setDescription(
                `**You have been muted in ${guild.name} for ${ms(timeString(op.duration, { compact: false }))}**\n\n**Reason:**\n- ${op.reason ? op.reason : "No reason provided."}`,
              )
              .setColor("DarkPurple")
              .setTimestamp(),
          ],
          components: [createDisabledButton(guild.name)],
        })
        .catch();
      await op.member.timeout(timeString(op.duration), op.reason);

      int.editReply({
        embeds: [
          embed
            .setDescription(
              `${emojify(true)} | **Muted ${op.member.displayName} for ${ms(timeString(op.duration, { compact: true }))}** | ${op.reason ? op.reason : "No reason provided."}`,
            )
            .setColor("DarkPurple"),
        ],
        components: [],
      });
      return collector.stop();
    } catch (error) {
      console.error(error);
    }
  });
};
