const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder() 
    .setName('ping')
    .setDescription('Ping, pong!'),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: (interaction) => {
        interaction.reply('Hello, my ping is ' + interaction.client.ws.ping)
    }
}