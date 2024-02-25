module.exports = {
  name: "cat",
  execute: async (message, args, client) => {
    const ArrayOfCats = [
      "https://tenor.com/rKFHsvVO1oI.gif",
      "https://tenor.com/qvYTHT7d3qD.gif",
      "https://tenor.com/og31FNBTZef.gif",
    ];
    const TheChosenOne =
      ArrayOfCats[Math.floor(Math.random() * ArrayOfCats.length)];
    message.reply(`Meow! ${TheChosenOne}`);
  },
};
