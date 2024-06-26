const {
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const embeds = require("../../mongoose/schema/embeds");
const { Utils } = require("../../helpers/utils");

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  const name = interaction.options.getString("name");
  const data = await embeds.findOne({ name: name });

  if (!data) {
    return interaction.editReply({
      embeds: [
        Utils.embeds.createUserError(interaction, [
          "Collection Not Found",
          "I can't find a embed with this name.",
        ]),
      ],
    });
  }

  if (interaction.user.id != data.authorId) {
    return interaction.editReply({
      embeds: [
        Utils.embeds.createUserError(interaction, [
          "Not Embed Author",
          "This embed does not belong to you, you cannot edit other user's embeds.",
        ]),
      ],
    });
  }

  const embed = Utils.embeds
    .createTemplate(interaction)
    .setDescription(
      `**Edit this embed using the buttons below**\n> Body - description & author field.\n> Footer - timestamp & footer field.\n> Image - thumbnail & image.`,
    )
    .setColor("Blurple");

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`embedbuttons-body:${name}`)
      .setLabel("Body")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`embedbuttons-footer:${name}`)
      .setLabel("Footer")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`embedbuttons-image:${name}`)
      .setLabel("Image")
      .setStyle(ButtonStyle.Primary),
  );

  return interaction.editReply({ embeds: [embed], components: [buttons] });
};
