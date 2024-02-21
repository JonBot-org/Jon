const { Events, GuildMember } = require("discord.js");
const guilds = require('../../db/guilds');

module.exports.data = {
    name: Events.GuildMemberRemove,
    once: false
}

/**
 * @param {import('discord.js').GuildMember|import("discord.js").APIGuildMember} member
 */
module.exports.execute = async (member) => {
    if (!member instanceof GuildMember) return;
    const data = await guilds.findOne({ id: member.guild.id });
    if (!data) return;

    if (data.configurations.leave.enabled) {
    }
}