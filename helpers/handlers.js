const { Client, Collection, REST, Routes } = require("discord.js");
const fs = require("node:fs");
const { Utils } = require("./utils");

module.exports.Handlers = {
  /**
   * @param {Client} client
   */
  commands: (client) => {
    client.commands = new Collection();
    client.commandsArray = [];
    const files = fs.readdirSync("./commands/");
    for (const file of files) {
      const cmd = require(`../commands/${file}`);
      if (cmd.data) {
        client.commands.set(cmd.data.name, cmd);
        client.commandsArray.push(cmd.data.toJSON());
      } else {
        Utils.write.error(`[${file}]: File is missing data propertie.`);
      }
    }
  },

  /**
   * @param {Client} client
   */
  events: (client) => {
    const files = fs.readdirSync("./events/");
    for (const file of files) {
      const _ = require(`../events/${file}`);
      if (_.run && _.name) {
        client.on(_.name, (...args) => _.run(...args));
      } else {
        Utils.write.warn(
          `[${file}]: File is missing event name and/or run propertie.`,
        );
      }
    }
  },

  rest: {
    deploy: (client) => {
      Utils.write.info("Deploying (/) commands.");
      const rest = new REST().setToken(process.env.DISCORD_TOKEN);
      rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: client.commandsArray,
      });
      Utils.write.info("Succesfully deployed (/) commands.");
    },
  },
};
