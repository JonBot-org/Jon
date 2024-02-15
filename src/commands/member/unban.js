const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { emojify } = require('../../utils');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
    const { options, guild, member } = interaction;
    await interaction.deferReply();
    const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setTimestamp();

    if (member && !member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return interaction.editReply({ embeds: [embed.setDescription(`${emojify(false)} | **You don't have enough permissions to use this command**`).setColor('Red')] });
    }

    const op = {
        user: await client.users.fetch(options.getString('user')),
        reason: options.getString('reason')
    }

    if (!op.user) {
        return interaction.editReply({ embeds: [embed.setDescription(`${emojify(false)} | **I can't find a user with the provided user.**`).setColor('Red')] })
    }

    if (guild.ownerId === op.user.id) {
        return;
    }
}