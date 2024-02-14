const {
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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

  if (op.color && !Colors[op.color]) {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(false)} | **\`color\` option is not valid.** `,
          )
          .setColor("Orange"),
      ],
    });
  }

  const data = await db.guilds.findOne({ Id: guild.id });

  if (data && data.welcome.enabled) {
    data.welcome.content = op.content ? op.content : null;
    data.welcome.description = op.description ? op.description : null;
    data.welcome.color = op.color ? op.color : null;
    await data.save();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Test")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("welcome.test"),
    );

    interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(true)} | **Edited the welcome message.**\n- **To view the welcome message click the "Test" button.**`,
          )
          .setColor("DarkPurple"),
      ],
      components: [row],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      componentType: ComponentType.ButtonTets,
    });

    collector.on("collect", async (int) => {
      await int.deferUpdate();
      if (!int.customId === "welcome.test") return;
      let updateObject = {};
      if (op.content && op.description) {
        updateObject = {
          content: replaceAllMemberDescription(op.content, member),
          components: [],
          embeds: [
            embed
              .setDescription(
                replaceAllMemberDescription(op.description, member),
              )
              .setColor(op.color ? op.color : "Random"),
          ],
        };
      } else if (!op.content && op.description) {
        updateObject = {
          embeds: [
            embed
              .setDescription(
                replaceAllMemberDescription(op.description, member),
              )
              .setColor(op.color ? op.color : "Random"),
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
  } else {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojify(false)} | **Welcome module is disabled in this server.**\n- **/welcome enable** : To enable the module`,
          )
          .setColor("DarkPurple"),
      ],
    });
  }
};
