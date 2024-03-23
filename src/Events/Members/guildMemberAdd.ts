import { Events, GuildMember } from "discord.js";
import { EventConfigOptions, HandleGreetModule } from "../../lib/index.m";
import Config from "../../Mongo/Models/Config";

export const config: EventConfigOptions = {
    name: Events.GuildMemberAdd,
    once: false
}

export async function run(member: GuildMember) {
    const _config = await Config.findOne({ id: member.guild.id });

    if (_config) {
        if (_config.greet?.enabled) {
            HandleGreetModule(member, _config.greet)
        }
    }
}