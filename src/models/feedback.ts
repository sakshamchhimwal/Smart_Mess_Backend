import mongoose, { Schema } from "mongoose";
import mess from "./mess";
import user from "./user";

const feedback = new Schema({
  Email: {
    type: String,
    required: true,
  },
  BreakfastRating: {
    type: Number,
    required: true,
  },
  LunchRating: {
    type: Number,
    required: true,
  },
  DinnerRating: {
    type: Number,
    required: true,
  },
  SnacksRating: {
    type: Number,
    required: true,
  },
  Feedback: {
    type: String,
    required: true,
  },
  MessServiceRating: {
    type: Number,
    required: true,
  },
  HygieneRating: {
    type: Number,
    required: true,
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