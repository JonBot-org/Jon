
/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports = async (interaction, client) => {
    await interaction.deferReply({ fetchReply: true });
    const { guild, options, member } = interaction;

    const message = options.getString('message');
    const description = options.getString('description')
    const title = options.getString('title')
    const author_name = options.getString('author_name')
    const author_icon = options.getString('author_icon')
    const color = options.getString('color')
    const timestamp = options.getBoolean('timestamp');
    
}