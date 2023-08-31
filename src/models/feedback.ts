import mongoose, { Schema } from "mongoose";
import mess from "./mess";

const feedback = new Schema({
  UserID: {
    type: String,
    required: true,
  },
  Feedback: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
  },
  Date: {
    type: Date,
    required: true,
  },
  Mess: {
    type: mess,
    required: true,
  },
});

export default mongoose.model("Feedback", feedback);
