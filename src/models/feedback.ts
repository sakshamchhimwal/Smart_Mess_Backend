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
    type: Schema.Types.ObjectId,
    ref: "mess",
    required: true,
  },
});

export default mongoose.model("Feedback", feedback);
