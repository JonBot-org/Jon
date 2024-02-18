const {
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { emojify, replaceAllMemberDescription } = require("../../utils");
const db = require("../../mongo/index");

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  const { options, guild, user } = interaction;
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

  const op = {
    content: options.getString("content"),
    description: options.getString("description"),
    color: options.getString("color"),
  };

  if (!op.content && !op.description) {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(false)} | **Either \`content\` or \`description\` option has to be present.**`,
          )
          .setColor("Orange"),
      ],
    });
  }

  if (op.colors && !Colors[op.color]) {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(false)} | **\`color\` option is not a valid color`,
          )
          .setColor("Orange"),
      ],
    });
  }

  const data = await db.guilds.findOne({ Id: guild.id });

  if (data && data.leaves.enabled) {
    data.leaves.content = op.content ? op.content : null;
    data.leaves.description = op.description ? op.description : null;
    data.leaves.color = op.color ? op.color : null;
    await data.save();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("leave.edit-test")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Test"),
    );

    interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(true)} | **Edited the message.**\n- **To view the message click the "Test" button.**`,
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
      if (!int.customId === "leave.edit-test") return;
      await int.deferUpdate();
      embed.setColor(op.color ? op.color : "Random");
      let updateObject = {};
      if (op.content && op.description) {
        updateObject = {
          content: replaceAllMemberDescription(op.content, member),
          embeds: [
            embed.setDescription(
              replaceAllMemberDescription(op.description, member),
            ),
          ],
          components: [],
        };
      } else if (!op.content && op.description) {
        updateObject = {
          embeds: [
            embed.setDescription(
              replaceAllMemberDescription(op.description, member),
            ),
          ],
          components: [],
        };
      } else if (op.content && !op.description) {
        updateObject = {
          content: replaceAllMemberDescription(op.content, member),
          components: [],
          embeds: [],
        };
      }

      int.editReply(updateObject);
      return collector.stop();
    });

    collector.on("end", () => {
      return interaction.editReply({
        content: "This menu has **expired**, please re-run this command.",
        components: [],
      });
    });
  } else {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(false)} | **Leave module is disabled in this server**\n- **To enable use /leave enable**`,
          )
          .setColor("Orange"),
      ],
    });
  }
};
