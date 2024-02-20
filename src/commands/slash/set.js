const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription("Configure settings.")
    .setDMPermission(false),
};

module.exports.execute = () => {
  console.log("mice");
};
