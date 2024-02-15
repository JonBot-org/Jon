const {
  PermissionFlagsBits,
  EmbedBuilder,
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { emojify, createDisabledButton } = require("../../utils");

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

  if (member && !member.permissions.has(PermissionFlagsBits.BanMembers)) {
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
        .setDescription(`**Checking if this user is banned**`)
        .setColor("DarkPurple"),
    ],
  });

  const op = {
    user: options.getString("user"),
    reason: options.getString("reason"),
  };

  if (guild.ownerId === op.user) {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(false)} | **I can't unban a member who is not banned, and also the guild owner.`,
          )
          .setColor("Red"),
      ],
    });
  }

  if (client.user.id === op.user) {
    return interaction.editReply({
      embeds: [
        embed.setDescription(`${emojify(false)} | **I can't unban me**`),
      ],
    });
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("member.unban-yes")
      .setStyle(ButtonStyle.Success)
      .setLabel("Yes"),
    new ButtonBuilder()
      .setCustomId("member.unban-no")
      .setStyle(ButtonStyle.Danger)
      .setLabel("No"),
  );

  const message = await interaction.editReply({
    embeds: [
      embed
        .setDescription(
          `${emojify(true)} | **All the checks have been completed.**\n- **Do you want to continue unbanning this member?**`,
        )
        .setColor("DarkPurple"),
    ],
    components: [row],
  });

  const collector = await message.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    componentType: ComponentType.Button,
  });

  collector.on("collect", async (int) => {
    if (int.customId === "member.unban-no") {
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
      const user = await guild.bans.remove(op.user, op.reason);

      await user
        .send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
              .setDescription(
                `**You have been unbanned from ${guild.name}**\n\n**Reason:**\n${op.reason ? op.reason : "No reason provided"}`,
              )
              .setColor("DarkPurple")
              .setTimestamp(),
          ],
          components: [createDisabledButton(guild.name)],
        })
        .catch(console.error);

      int.editReply({
        embeds: [
          embed.setDescription(
            `${emojify(true)} | **Successfully unbanned ${user.username}**`,
          ),
        ],
        components: [],
      });
      return collector.stop();
    } catch (error) {
      console.error(error)
      if (error.rawError.message === "Unknown Ban") {
        int.editReply({
          components: [],
          embeds: [
            embed
              .setDescription(
                `${emojify(false)} | **This user is not banned from this guild.**`,
              )
              .setColor("Red"),
          ],
        });
      }
    }
  });
};
