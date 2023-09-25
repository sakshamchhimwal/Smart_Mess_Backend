import mongoose, { Schema } from "mongoose";
import { emit } from "process";

const notificationToken = new Schema({
    Email: {
        type: String,
        required: true,
    },
    Token: {
        type: String,
        required: true,
    },
    Platform: {
        type: String, //android or ios or web
        required: true,
    },
});

export default mongoose.model("NotificationToken", notificationToken);