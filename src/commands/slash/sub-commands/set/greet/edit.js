const {
  EmbedBuilder,
  Colors
} = require("discord.js");
const guilds = require("../../../../../db/guilds");
const { isImage, emojis } = require("../../../../../lib/functions");

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
  const timestamp = options.getBoolean("timestamp") || false;

  const ErrorEmbed = new EmbedBuilder()
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
    .setDescription(`${emojis.fail} | Option validation failed.\n`)
    .setColor("DarkVividPink")
    .setTimestamp();

  if (!message && !description) {
    ErrorEmbed.data.description += `» **Error:**\n\- One option from \`message\` or \`description\` has to be provided. `;
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  if (color && !description) {
    ErrorEmbed.data.description += `» **Error:**\n\- \`color\` option found but \`description\` not found, if you want to use a embed you need a description. `;
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  if (title && !description) {
    ErrorEmbed.data.description += `» **Error:**\n\- \`title\` option ,found but \`description\` not found, if you want to use a embed you need a description. `;
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  if (author_name && !description) {
    ErrorEmbed.data.description += `» **Error:**\n\- \`author_name\` option found but \`description\` not found, if you want to use a embed you need a description. `;
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  if (author_icon && !author_name) {
    ErrorEmbed.data.description += `» **Error**\n\- \`author_icon\` option found but \`author_name\` not found, if you want to use author field authorName is required. `;
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  if (
    author_icon &&
    !isImage(author_icon) &&
    !["{user_avatar}", "{server_icon}"].includes(author_icon)
  ) {
    ErrorEmbed.data.description += `» **Error:**\n\- \`author_icon\` is not formatted correctly.\n» **Formats:** links & vars`;
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  if (color && !Colors[color]) {
    ErrorEmbed.data.description += `» **Error:**\n\- \`color\` option is not a valid color.\n» **Colors:** Red, Green, Blue, Blurple & more...`;
    return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
  }

  await interaction.deferReply();
  const data = await guilds.findOne({ id: guild.id });

  if (data && data.configurations.greet.enabled) {
    data.configurations.greet.message = message ? message : null;
    data.configurations.greet.description = description ? description : null;
    data.configurations.greet.title = title ? title : null;
    data.configurations.greet.author_name = author_name ? author_name : null;
    data.configurations.greet.author_icon = author_icon ? author_icon : null;
    data.configurations.greet.color = color ? color : null;
    data.configurations.greet.timestamp = timestamp ? "YES" : "NO";
    await data.save();

    const CompleteEmbed = new EmbedBuilder()
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL(),
      })
      .setDescription(`${emojis.success} | **Edited the greet message.**`)
      .setColor("LuminousVividPink")
      .setTimestamp();

    return interaction.editReply({ embeds: [CompleteEmbed] });
  } else {
    const GreetDisabledEmbed = new EmbedBuilder()
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL(),
      })
      .setDescription(`${emojis.fail} | **Greet module is disabled in this server.**`)
      .setColor("LuminousVividPink")
      .setTimestamp();

    return interaction.editReply({ embeds: [GreetDisabledEmbed] });
  }
};
