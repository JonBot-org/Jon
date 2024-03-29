import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema({
  id: String,

  greet: {
    enabled: Boolean,
    channel: String,
    content: String,
    embed: String,
  },
});

export default mongoose.model("config", ConfigSchema);
