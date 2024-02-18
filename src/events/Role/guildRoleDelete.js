const { Events, EmbedBuilder } = require("discord.js");
const db = require('../../mongo/index');

module.exports = {
    name: Events.GuildRoleDelete,
    type: 'client',
    /** 
     * @param {import('discord.js').Role} role
     */
    run: async (role) => {
        const data = await db.config.findOne({ Id: role.guild.id });
    
        const embed = new EmbedBuilder()
        .setAuthor({ name: role.guild.name, iconURL: role.guild.iconURL() })
        .setDescription(`**<@&${role.id}> (${role.name}) role was deleted.**`)
        .setFooter({ text: `roleID: ${role.id}` })
        .setColor('Orange')
        .setTimestamp();

        if (data && data.server_logs.enabled) {
            const channel = await role.guild.channels.fetch(data.server_logs.channel);
            if (channel) {
                channel.send({ embeds: [embed] });
            }
        }
    }
}