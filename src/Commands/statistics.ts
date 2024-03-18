import { SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../lib/index.m";

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

  chatInputRun(interaction) {},
};
