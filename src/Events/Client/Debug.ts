import { Events } from "discord.js";
import { EventConfigOptions, Logger } from "../../lib/index.m";

export const config: EventConfigOptions = {
  name: Events.Debug,
  once: false,
};

export function run(message: string) {
  Logger.prototype.debug(message);
}
