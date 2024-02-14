const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { emojify } = require('../../utils');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
    const { options, guild, user } = interaction;
    await interaction.deferReply();
    const member = await guild.members.fetch(user.id);
    const embed = new EmbedBuilder()
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
    .setTimestamp();

    if (member && !member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return interaction.editReply({ embeds: [embed.setDescription(`${emojify(false)} | **You don't have emough permissions to use this command.**`).setColor('Red')] });
    }

    interaction.editReply({ embeds: [embed.setDescription(`${emojify(true)} | **Checking if this member is bannable**`).setColor('DarkPurple')] });

    const op = {
        member: await guild.members.fetch(options.getUser('member').id),
        deleteMessageSeconds: options.getNumber('delete'),
        reason: options.getString('reason')
    };

    if (guild.ownerId === op.member.id) {
        return interaction.editReply({ embeds: [embed.setDescription(`${emojify(false)} | **I can't ban the guild owner.**`).setColor('Red')] })
    }

    if (client.user.id === op.member.id) {
        return interaction.editReply({ embeds: [embed.setDescription(`${emojify(false)} | **I can't ban myself.**`).setColor('Red')] });
    }

    if (op.member.roles.highest.comparePositionTo(member.roles.highest) >= 1) {
        return interaction.editReply({ embeds: [embed.setDescription(`${emojify(false)} | **${op.member} has a higher role than you.**`).setColor('Red')] });
    }

    if (!op.member.bannable) {
        return interaction.editReply({ embeds: [embed.setDescription(`${emojify(false)} | **I can't ban this member**`).setColor('Red')] });
    }

    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId('member.ban-yes')
        .setStyle(ButtonStyle.Success)
        .setLabel('Yes'),
        new ButtonBuilder()
        .setCustomId('member.ban-no')
        .setStyle(ButtonStyle.Danger)
        .setLabel('No')
    );

    interaction.editReply({ embeds: [embed.setDescription(`**All the checks have been completed.**\n- **Are you sure you want to ban ${op.member}?**`).setColor('DarkPurple')], components: [row] });

    const collector = interaction.channel.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        componentType: ComponentType.Button
    });

    collector.on('collect', async (int) => {
        if (int.customId === "member.ban-no") {
            return int.update({ components: [], embeds: [embed.setDescription(`${emojify(false)} | **Canceled this process**`).setColor('DarkPurple')] });
        }

        try {
            await member.ban({ 
                deleteMessageSeconds: op.deleteMessageSeconds,
                reason: op.reason ? op.reason : 'No reason provided.'
            });

            return int.update({ components: [], embeds: [embed.setDescription(`${emojify(true)} | **Banned ${member.user.username}** | ${op.reason ? op.reason : 'No reason provided'}`).setColor('DarkPurple')] });
        } catch (error) {
            console.error(error)
        }
    });
}