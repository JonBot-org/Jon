const { ChatInputCommandInteraction } = require("discord.js");
const embeds = require('../../mongoose/schema/embeds');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const name = interaction.options.getString('name');
    const data = await embeds.find({ data: { authorName: `${interaction.user.username}:${interaction.user.id}` } });
    console.log(data)
}