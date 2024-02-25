module.exports = {
  name: "t",
  /**
   * @param {import('discord.js').Message} message
   * @param {import('discord.js').Client} client
   */
  execute: async (message, args, client) => {
    if (message.author.id === "1125852865534107678") return;
    const application = await client.application.fetch();
    const commands = await application.commands.fetch();

    message.reply(
      `${commands.map((command) => command.name + " " + command.id).join("\n")}`,
    );
  },
};
