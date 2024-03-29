const {
  ButtonInteraction,
  ActionRowBuilder,
  TextInputBuilder,
  ModalBuilder,
  TextInputStyle
} = require("discord.js");
const embeds = require("../mongoose/schema/embeds");
const { Utils } = require("../helpers/utils");
const { Templates } = require("../helpers/templates");

/**
 * @param {ButtonInteraction} interaction
 * @param {string} id
 */
module.exports = async (interaction, id) => {
  const name = id.split(":").at(1);
  const _id = id.split(":").at(0);
  const data = await embeds.findOne({ name: name });

  if (!data) {
    return interaction.editReply({
      embeds: [
        Utils.embeds.createUserError(interaction, [
          Templates.errors.db.DOC_NOT_FOUND.type,
          Templates.errors.db.DOC_NOT_FOUND.content,
        ]),
      ],
    });
  }

  if (_id === "body") {
    const authorName = new ActionRowBuilder()
    .addComponents(
        new TextInputBuilder()
        .setCustomId('embed-authorName')
        .setStyle(TextInputStyle.Short)
        .setLabel('Author Name')
        .setPlaceholder('Please enter a author name.')
        .setValue(data.author.name ? data.author.iconURL : '')
        .setMaxLength(250)
    );

    const authorIcon = new ActionRowBuilder()
    .addComponents(
      new TextInputBuilder()
      .setCustomId('embed-authorIcon')
      .setStyle(TextInputStyle.Short)
      .setLabel('Author Icon')
      .setPlaceholder('Please enter a author icon.')
      .setValue(data.author.iconURL ? data.author.iconURL : '')
      .setMaxLength(250)
    );

    const description = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("embed-description")
        .setStyle(TextInputStyle.Paragraph)
        .setLabel("Description")
        .setPlaceholder("Please enter a description.")
        .setValue(data.description ? data.description : '')
        .setMaxLength(4000)
    );

    const modal = new ModalBuilder()
      .setCustomId("embed-body")
      .setTitle("Edit Embed")
      .addComponents(authorName, authorIcon, description);

    await interaction.showModal(modal)

    const m = await interaction.awaitModalSubmit({ time: 10800000 }).then(async (int) => {
      await int.deferUpdate();
      const authorName = int.fields.getField('embed-authorName').value;
      const authorIcon = int.fields.getField('embed-authorIcon').value;
      const description = int.fields.getField('embed-description').value;

      console.log(authorName, authorIcon, description);

      data.author.name = authorName;
      data.author.iconURL = authorIcon;
      data.description = description;
      await data.save();

      const embed = Utils.embeds.createTemplate(interaction) 
      .setDescription('**Updated embed settings.**')
      .setColor('Blurple');

      return int.editReply({ embeds: [embed] });
    }).catch((reason) => console.error(reason));
  }
};
