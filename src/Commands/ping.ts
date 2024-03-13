import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../lib/index.m";

export const command: CommandOptions = {
  application: {
    enabled: true,
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Ping, Pong!"),
  },

  message: {
    enabled: true,
  },

  chatInputRun(interaction) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(`**Ping:** ${interaction.client.ws.ping}ms`)
          .setColor("Blurple")
          .setTimestamp(),
      ],
    });
  },

  messageRun(message, { args }) {
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL(),
          })
          .setDescription(`**Ping:** ${message.client.ws.ping}ms`)
          .setColor("Blurple")
          .setTimestamp(),
      ],
    });
  },
};
