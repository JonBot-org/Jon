import { VariablesFunction, formatYMD } from "../index.m"

export function formatVariables(text: string, o: VariablesFunction): string {
    return text
    .replaceAll('{username}', o.user.username)
    .replaceAll('{useravatar}', o.user.displayAvatarURL({ extension: 'png', size: 512 }))
    .replaceAll('{usercreatedat}', formatYMD(new Date(o.user.createdAt)))
}

export const variables = [
    "user:{username}",
    "user:{useravatar}",
    "user:{usercreatedat}",
    "user:{usercreatedtimestamp}",

    "guild:{guildname}",
    "guild:{guildicon}",

    "utils:{Fchannel:id}",
    "utils:{Fuser:id}",
    "utils:{randomjoke|quote}"
]