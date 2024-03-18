import { Events } from "discord.js";
import { EventConfigOptions } from "../../lib/index.m";

export const config: EventConfigOptions = {
  name: Events.Debug,
  once: false,
};

export function run(message: string) {
  console.info(message);
}
