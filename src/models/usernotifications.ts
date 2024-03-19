import mongoose, { Schema } from "mongoose";
import mess from "./mess"; // Commented out for now, as you mentioned
import user from "./user";

const usernotifications = new Schema({
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
  Attachment: {
    type: String, // URL of the attachment
    default: "",
  },
  // Uncomment or modify when multiple messes are considered
  // Mess: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Mess",
  //   required: true,
  // },
  // Array of user ids who have read the notification
  readBy: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  // Array of user ids to whom the notification is sent
  sendTo: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
});

export default mongoose.model("usernotifications",usernotifications);
