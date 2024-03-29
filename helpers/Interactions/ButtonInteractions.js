const { ButtonInteraction } = require("discord.js");

/**
 * @param {ButtonInteraction} interaction
 */
module.exports = async (interaction) => {
  const { client } = interaction;

  // Embed (edit) button handler
  if (interaction.customId.includes("embedbuttons")) {
    require("../../buttons/embedbuttons")(
      interaction,
      splitCustomId("-", interaction).at(1),
    );
  }
};

/**
 * @param {ButtonInteraction} interaction
 * @param {string} str
 */
function splitCustomId(str, interaction) {
  return interaction.customId.split(str);
}
