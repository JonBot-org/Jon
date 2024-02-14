require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require("discord.js");
const fs = require("node:fs");
const chalk = require("chalk");
const { default: mongoose } = require("mongoose");
const db = require("./mongo/index");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages],
  partials: [Partials.Channel, Partials.User],
});

(() => {
  console.log(chalk.yellow(`[BOT] || Starting event handler...`));
  const folders = fs.readdirSync(`./src/events/`);
  for (const folder of folders) {
    console.log(chalk.cyan(`[BOT] || Reading ${folder}...`));
    const files = fs.readdirSync(`./src/events/${folder}/`);
    for (const file of files) {
      console.log(chalk.cyan(`[BOT] || Reading ${folder}/${file}`));
      const event = require(`./events/${folder}/${file}`);
      if (event.type === "client") {
        if (event.name) {
          client.on(event.name, (...args) => event.run(...args));
        } else {
          console.log(
            chalk.red(
              `[BOT] || ${folder}/${file} : event#name is not present.`,
            ),
          );
        }
      } else {
        if (event.name) {
          process.on(event.name, (...args) => event.run(...args));
        } else {
          console.log(
            chalk.red(
              `[PROCESS] || ${folder}/${file} : event#name is not present.`,
            ),
          );
        }
      }
    }
  }

  console.log(
    chalk.green(`[BOT] || Successfully finished reading event files.`),
  );
})();

(async () => {
  client.commands = new Collection();
  client.commandsArray = [];
  console.log(chalk.yellow(`[BOT] || Starting command handler...`));
  const files = fs
    .readdirSync("./src/commands/")
    .filter((v) => v.endsWith(".js"));
  for (const file of files) {
    console.log(chalk.cyan(`[COMMAND] || Reading ${file}...`));
    const command = require(`./commands/${file}`);
    if (command.data) {
      client.commands.set(command.data.name, command);
      client.commandsArray.push(command.data.toJSON());
    } else {
      console.log(
        chalk.red(`[COMMAND] || ${file} : command#data is not present.`),
      );
    }
  }
})();

async function start() {
  try {
    client.db = db;
    mongoose.connect(process.env.MONGO_DB).then(() => {
      console.log(chalk.green("[MONGO] || Connected"));
    });
    await client.login();
  } catch (error) {
    console.error(chalk.red(error));
  }
}

void start();
