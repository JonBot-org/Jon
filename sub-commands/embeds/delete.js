const {
  ChatInputCommandInteraction,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const embeds = require("../../mongoose/schema/embeds");
const { Utils } = require("../../helpers/utils");
const { Templates } = require("../../helpers/templates");

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
          Templates.errors.db.DOC_NOT_FOUND.type,
          Templates.errors.db.DOC_NOT_FOUND.content.replace("{type}", "embed"),
        ]),
      ],
    });
  }

  if (data.authorId != interaction.user.id) {
    return interaction.editReply({
      embeds: [
        Utils.embeds.createUserError(interaction, [
          Templates.errors.AUTHORINEUSER.type,
          Templates.errors.AUTHORINEUSER.content.replace(
            "{author}",
            data.authorId,
          ),
        ]),
      ],
    });
  }

  await embeds.deleteOne({ name: name });

  const embed = Utils.embeds
    .createTemplate(interaction)
    .setDescription("**Deleted the embed.**")
    .setColor("Blurple");

  return interaction.editReply({ embeds: [embed] });
};
