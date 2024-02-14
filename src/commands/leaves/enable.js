const { PermissionFlagsBits, EmbedBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { emojify } = require('../../utils');
const db = require('../../mongo/index');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
    const { options, guild, user } = interaction;
    await interaction.deferReply();
    const member = await guild.members.fetch(user.id);
    const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setTimestamp();

    if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.editReply({ embeds: [embed.setDescription(`${emojify(false)} | **You don't have enough permissions to use this command.**`).setColor('Red')] });
    }

    const op = {
        channel: options.getChannel('channel')
    }

    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId('leave.enable-yes')
        .setStyle(ButtonStyle.Success)
        .setLabel('Yes'),
        new ButtonBuilder()
        .setCustomId('leave.enable-no')
        .setStyle(ButtonStyle.Danger)
        .setLabel('No')
    );

    interaction.editReply({ embeds: [embed.setDescription(`**Are you sure you want to continue?**\n- **Channel: ${op.channel}**`).setColor('DarkPurple')], components: [row] });

    const collector = interaction.channel.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        componentType: ComponentType.Button
    });

    collector.on('collect', async (int) => {
        if (int.customId === "leave.enable-no") {
            int.update({ embeds: [embed.setDescription(`${emojify(false)} | **Cancelled this process.**\n- **Use /leave enable to run this command again**`).setColor('DarkPurple')], components: [] });
            return collector.stop();
        }

        await int.deferUpdate();
        const data = await db.guilds.findOne({ Id: guild.id });

        if (data) {
            data.leaves.enabled = true;
            data.leaves.channel = op.channel.id;
            await data.save();
        } else {
            await db.guilds.create({
                Id: guild.id,
                leaves: {
                    enabled: true,
                    channel: op.channel.id
                }
            });
        }

        return int.editReply({ embeds: [embed.setDescription(`${emojify(true)} | **Leave module is now emabled**\n- **Channel: ${op.channel}**`).setColor('DarkPurple')], components: [] });
    });
}