require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  REST,
  Collection,
  Routes,
} = require("discord.js");
const fs = require("node:fs");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

(() => {
  console.log(`[BOT] || Starting event handler...`);
  const folders = fs.readdirSync(`./src/events/`);
  for (const folder of folders) {
    console.log(`[BOT] || Reading ${folder}...`);
    const files = fs.readdirSync(`./src/events/${folder}/`);
    for (const file of files) {
      console.log(`[BOT] || Reading ${folder}/${file}`);
      const event = require(`./events/${folder}/${file}`);
      if (event.type === "client") {
        if (event.name) {
          client.on(event.name, (...args) => event.run(...args));
        } else {
          console.log(
            `[BOT] || ${folder}/${file} : event#name is not present.`,
          );
        }
      } else {
        if (event.name) {
          process.on(event.name, (...args) => event.run(...args));
        } else {
          console.log(
            `[PROCESS] || ${folder}/${file} : event#name is not present.`,
          );
        }
      }
    }
  }

  console.log(`[BOT] || Successfully finished reading event files.`);
})();

(() => {
  client.commands = new Collection();
  client.commandsArray = [];
  console.log(`[BOT] || Starting command handler...`);
  const files = fs.readdirSync("./src/commands/");
  for (const file of files) {
    console.log(`[COMMAND] || Reading ${file}...`);
    const command = require(`./commands/${file}`);
    if (command.data) {
      client.commands.set(command.data.name, command);
      client.commandsArray.push(command.data.toJSON());
    } else {
      console.log(
        `[COMMAND] || ${folder}/${file} : command#data is not present.`,
      );
    }
  }
})();

(async () => {
  console.log(`[COMMAND] || Initializing REST client...`);
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  const data = await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    {
      body: client.commandsArray,
    },
  );
  console.log(`[COMMAND] || Updated (/) commands.`);
})();

client.login();
