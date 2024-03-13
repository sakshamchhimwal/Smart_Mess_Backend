import mongoose, { Schema } from "mongoose";
import mess from "./mess";
import user from "./user";

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
  Attachment: {
    type: String, //url of the attachement
    default: "",
  },
  // Mess: {    //we will add this later if we have mutliple messes
  //   type: mess,
  //   required: true,
  // },
  //array of user ids who have read the notification
  readBy: {
    type: [Schema.Types.ObjectId],
    ref: "user",
    required: true,
  },
});

export default mongoose.model("Notifications", notification);
