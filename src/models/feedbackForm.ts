import mongoose, { Schema } from "mongoose";

const feedbackForm = new Schema({
    Title: {
        type: String,
        required: true,
    },
    Description: String,
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