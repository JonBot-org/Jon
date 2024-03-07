const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");

module.exports = {
  name: "whois",
  category: "utility",
  description: "",
  /**
   * @param {import('discord.js').Message} message
   * @param {import('discord.js').Client} client
   */
  execute: async (message, args, client) => {
    try {
      let userId = message.mentions.members.first()?.id || args[0];

      if (!userId) userId = message.author.id;

      if (isNaN(userId)) {
        const notAValidId = new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL(),
          })
          .setDescription("The given userId is invalid. `userId:` " + userId)
          .setColor("LuminousVividPink")
          .setTimestamp();

        return message.reply({ embeds: [notAValidId] });
      }

      const member = await message.guild.members.fetch(userId);

      if (!member) {
        const noMemberFound = new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL(),
          })
          .setDescription(`Invalid member. \`userId:\` ${userId}`)
          .setColor("LuminousVividPink")
          .setTimestamp();
        return message.reply({ embeds: [noMemberFound] });
      }

      const successRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("m-u.flags")
          .setLabel("Flags")
          .setStyle(ButtonStyle.Primary),
      );

      const successEmbed = new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.user.displayAvatarURL(),
        })
        .setDescription(
          `\`Name:\` ${member.displayName}\n\`Created At:\` <t:${(new Date(member.user.createdAt).getTime() / 1000).toFixed(0)}>\n\`Joined At:\` <t:${(new Date(member.joinedAt).getTime() / 1000).toFixed(0)}>`,
        )
        .setColor("LuminousVividPink")
        .setTimestamp();

      const msg = await message.channel.send({
        embeds: [successEmbed],
        components: [successRow],
      });

      const collector = msg.createMessageComponentCollector({
        filter: (interaction) => interaction.user.id === message.author.id,
        componentType: ComponentType.Button,
      });

      collector.on("collect", async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (interaction.customId === "m-u.flags") {
          const flagsEmbed = new EmbedBuilder()
            .setAuthor({
              name: member.user.username,
              iconURL: member.user.displayAvatarURL(),
            })
            .setDescription(
              `> **Member Flags:**\n${!member.flags.toArray() ? "No Flags." : member.flags.toArray()}\n> **User Flags:**\n${!member.user.flags.toArray() ? "No Flags." : member.user.flags.toArray().join("\n")}`,
            )
            .setColor("LuminousVividPink")
            .setTimestamp();

          interaction.editReply({ embeds: [flagsEmbed] });
          return collector.stop();
        }
      });
    } catch (error) {
      if (error.rawError.message === "Invalid Form Body") {
        return message.reply(
          "Invalid userId. `Error:` " +
            error.rawError.errors.user_id._errors[0].message,
        );
      }
    }
  },
};
