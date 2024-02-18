require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require("discord.js");
const fs = require("node:fs");
const { default: mongoose } = require("mongoose");
const db = require("./mongo/index");
const { log } = require("./utils");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Channel, Partials.User, Partials.Message],
});

(() => {
  const folders = fs.readdirSync(`./src/events/`);
  for (const folder of folders) {
    const files = fs.readdirSync(`./src/events/${folder}/`);
    for (const file of files) {
      const event = require(`./events/${folder}/${file}`);
      if (event.type === "client") {
        if (event.name) {
          client.on(event.name, (...args) => event.run(...args));
        } else {
          log("w", `${folder}/${file}.js is missing event#name`);
        }
      } else {
        if (event.name) {
          process.on(event.name, (...args) => event.run(...args));
        } else {
          log("w", `${folder}/${file}.js is missing event#name`);
        }
      }
    }
  }
})();

(async () => {
  client.commands = new Collection();
  client.commandsArray = [];
  const files = fs
    .readdirSync("./src/commands/")
    .filter((v) => v.endsWith(".js"));
  for (const file of files) {
    const command = require(`./commands/${file}`);
    if (command.data) {
      client.commands.set(command.data.name, command);
      client.commandsArray.push(command.data.toJSON());
    } else {
      log("w", `${file} is missing command#data properties.`);
    }
  }
})();

async function start() {
  try {
    client.db = db;
    mongoose.connect(process.env.MONGO_DB).then(() => {
      log("i", "MongoDB connected!");
    });
    await client.login();
  } catch (error) {
    log("e", error);
  }
}

void start();
