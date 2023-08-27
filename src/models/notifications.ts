import mongoose, { Schema } from "mongoose";
import mess from "./mess";

const notification = new Schema({
  Title: {
    type: String,
    required: true,
  },
  Message: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Mess: {
    type: mess,
    required: true,
  }
});

export default mongoose.model("Notifications", notification);
