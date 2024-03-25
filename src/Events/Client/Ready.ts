import { Events } from "discord.js";
import { EventConfigOptions, JonBot } from "../../lib/index.m";

export const config: EventConfigOptions = {
  name: Events.ClientReady,
  once: true,
};

export function run(client: JonBot) {
  if (client.user?.id === process.env.PDCI) {
    process.env.NODE_ENV = "production";
  } else {
    process.env.NODE_ENV = "development";
  }

  client.logger.info(
    `Ready! ${client.user?.username} - ${process.env.NODE_ENV}`,
  );

  client.handleCommands();
}
