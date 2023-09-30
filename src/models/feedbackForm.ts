import mongoose, { Schema } from "mongoose";

const feedbackForm = new Schema({
  FormType: {
    type: String, //weekly or monthly
    enum: ["weekly", "monthly"],
    required: true,
  },
  FormStartDate: {
    type: Date,
    required: true,
  },
  FormEndDate: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("FeedbackForm", feedbackForm);