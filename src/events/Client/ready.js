const { Client, REST, Routes } = require("discord.js");
const chalk = require("chalk");

module.exports = {
  name: "ready",
  type: "client",
  /**
   * @param {Client} client
   */
  run: (client) => {
    if (client.user.id === "1188538997786546287") {
      process.env.NODE_ENV = "production";
    } else {
      process.env.NODE_ENV = "development";
    }

    deploy(client);

    console.log(
      chalk.green(
        `[BOT] || ${client.user.username}, is ready! : ${process.env.NODE_ENV}`,
      ),
    );
  },
};

async function deploy(client) {
  console.log(chalk.yellow(`[COMMAND] || Initializing REST client...`));
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  const data = await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    {
      body: client.commandsArray,
    },
  );
  console.log(chalk.green(`[COMMAND] || Updated (/) commands.`));
}
