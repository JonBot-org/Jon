const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const process = require("node:process");
const { Logger } = require("jon-lib");
const logger = new Logger();

/**
 * @param {import('discord.js').Client} client 
 */
function handleEvents(client) {
  const folders = fs.readdirSync('./src/events/');
  for (const folder of folders) {
    const files = fs.readdirSync('./src/events/' + folder);
    for (const file of files) {
      const event = require(`../events/${folder}/${file}`);
      if (!event.data && !event.execute) logger.warn(`${folder}/${file} -> is missing #data or #execute properties.`);
      client[event.data.once ? 'once' : 'on'](event.data.name, (...args) => event.execute.bind(...args, client));
    }
  }
}

/**
 * @param {import('discord.js').Client} client
 */
function handleCommands(client) {
  const slash_data = [];
  const slash_dir = fs.readdirSync(`./src/commands/slash/`);
  for (const slash_file of slash_dir) {
    const slash = require("../commands/slash/" + slash_file);
    if (!slash.data)
      logger.warn(`${slash_dir}/${slash_file} -> is missing #data propertie`);
    client.applicationCommands.set(slash.data.name, slash);
    slash_data.push(slash.data.toJSON());
  }

  deploy_slashcommands(slash_data);

  const message_dir = fs.readdirSync('./src/commands/message/');
  for (const message_folder of message_dir) {
    const message_files = fs.readdirSync('./src/commands/message/' +message_folder);
    for (const message_file of message_files) {
        const message = require('../commands/message/' + message_folder + '/' + message_files);
        if (!message.name) logger.warn(`${message_folder}/${message_file} -> is missing #name propertie.`);
        client.commands.set(message.name, message);
    }
  }
}

async function deploy_slashcommands(commands) {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  const data = await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    {
      body: commands,
    },
  );
  logger.info('Loaded commnads! (/)');
  return data;
}

module.exports = {
  handleCommands,
  handleEvents
};
