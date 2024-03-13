import { Events } from "discord.js";
import { EventConfigOptions, JonBot } from "../../lib/index.m";

export const config: EventConfigOptions = {
  name: Events.ClientReady,
  once: true,
};

export function run(client: JonBot) {
  client.logger.info(`Ready! ${client.user?.username}`);
}
