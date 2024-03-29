module.exports.Templates = {
  errors: {
    // Author ID is not equal to user ID | data.authorId != user.id
    AUTHORINEUSER: {
      type: "AuthorIDNotMatching",
      content:
        "You can't execute this action as this action can only be taken by <@{author}>",
    },

    db: {
      DOC_NOT_FOUND: {
        type: "NotFound",
        content: "I coudn't find a {type} with the name given.",
      },
    },
  },

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
