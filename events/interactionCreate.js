const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {import("discord.js").Interaction} interaction
   */
  run: (interaction) => {
    if (interaction.isChatInputCommand()) {
      require("../helpers/Interactions/ChatInputCommands")(interaction);
    } else if (interaction.isButton()) {
      require("../helpers/Interactions/ButtonInteractions")(interaction);
    }
  },
};
