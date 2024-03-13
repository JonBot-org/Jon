import mongoose from "mongoose";

const schema = new mongoose.Schema({
  id: String,

  greet: {
    enabled: Boolean,
    channel: String,
  },
});

export default mongoose.model("config", schema);
