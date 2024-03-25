import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../lib/index.m";
import { Bot } from "../Mongo/Models/Bot";

export const command: CommandOptions = {
  application: {
    enabled: true,
    data: new SlashCommandBuilder()
      .setName("stats")
      .setDescription("Statistics on the bot!"),
  },

  message: {
    enabled: false,
  },

  async chatInputRun(interaction) {
    await interaction.deferReply();

    const guilds = interaction.client.guilds.cache.size;
    const members = interaction.client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0,
    );
    const _data = await Bot.findOne({ _i: process.env.MIP });
    const buttons = _data?.buttonsClicked;
    const commands = _data?.commandsExecuted;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `**Stats:**\n- Servers: ${guilds}\n- Users: ${members}\n- Commands Ran: ${commands}\n- Buttons Clicked: ${buttons}`,
      )
      .setColor("Blurple")
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  },
};
