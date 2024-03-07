const { isImage, sleep, emojis } = require("../../../../../lib/functions");
const {
  Colors,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const guilds = require("../../../../../db/guilds");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (interaction) => {
  const { guild, options, user } = interaction;

  const message = options.getString("message");
  const description = options.getString("description");
  const title = options.getString("title");
  const author_name = options.getString("author_name");
  const author_icon = options.getString("author_icon");
  const color = options.getString("color");
  const timestamp = options.getBoolean("timestamp");

  const ErrorEmbed = new EmbedBuilder()
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
    .setDescription(`${emojis.fail} | Option validation failed.\n» **Error:**\n\- `)
    .setColor("DarkVividPink")
    .setTimestamp();

  if (!message && !description) {
    ErrorEmbed.data.description += `One option from \`message\` or \`description\` has to be provided.`;
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  if (color && !description) {
    ErrorEmbed.data.description += `\`color\` option found but \`description\` not found, if you want to use a embed you need a description.`;
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  if (title && !description) {
    ErrorEmbed.data.description += `\`title\` option found but \`description\` not found, if you want to use a embed you need a description. `;
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  if (author_name && !description) {
    ErrorEmbed.data.description += `\`author_nane\` option found but \`description\` not found, if you want to use a embed you need a description  `
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  if (author_icon && !author_name) {
    ErrorEmbed.data.description += `\`author_icon\` option found but \`author_name\` not found, if you want to use the author field you need a authorName. `
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  if (
    author_icon &&
    !isImage(author_icon) &&
    !["{user_avatar}", "{server_icon}"].includes(author_icon)
  ) {
    ErrorEmbed.data.description += `\`author_icon\` is not formatted correctly.\n» **Formats:** links & vars`
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  if (color && !Colors[color]) {
    ErrorEmbed.data.description += `\`color\` option is not a valid color.\n» **Colors:** Green, Blue, Purple & more...`
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  await interaction.deferReply();
  const data = await guilds.findOne({ id: guild.id });

  if (data) {
    data.configurations.leave.message = message ? message : null;
    data.configurations.leave.description = description ? description : null;
    data.configurations.leave.title = title ? title : null;
    data.configurations.leave.author_name = author_name ? author_name : null;
    data.configurations.leave.author_icon = author_icon ? author_icon : null;
    data.configurations.leave.color = color ? color : null;
    data.configurations.leave.timestamp = timestamp ? "YES" : "NO";
    await data.save();

    const CompleteEmbed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setDescription(`${emojis.success} | Edited the leave message.`)
      .setColor("LuminousVividPink")
      .setTimestamp();

    return interaction.editReply({ embeds: [CompleteEmbed] });
  } else {
    const LeaveDisabledEmbed = new EmbedBuilder()
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
    .setDescription(`${emojis.fail} | Leave module is disabled in this server.`)
    .setColor('LuminousVividPink')
    .setTimestamp();

    return interaction.editReply({ embeds: [LeaveDisabledEmbed] });
  }
};
