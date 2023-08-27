import mongoose, { Schema } from "mongoose";

const notif = new Schema({
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
});

module.exports = mongoose.model("Notification", notif);
