module.exports.Templates = {
  embed_c: {
    author: {
      name: "{user.name}",
      iconURL: "{user.pfp}",
    },

    footer: {
      text: "{server.name}",
    },

    description: `{dev.context}`,
    image: "{user.pfp}",
    thumbnail: "{server.icon}",
    timestamp: true,
  },
};
