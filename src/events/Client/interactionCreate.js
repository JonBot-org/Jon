module.exports = {
    name: 'interactionCreate',
    type: 'client',
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    run: (interaction) => {
        if (interaction.isChatInputCommand()) {
            console.log(`[COMMAND] || Finding command : ${interaction.commandName}`);

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                return;
            }

            console.log(`[COMMAND] || Executing ${command.name}...`);
            command.run(interaction);
        }
    }
}