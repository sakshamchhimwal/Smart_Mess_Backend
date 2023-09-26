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
  // Mess: {    //we will add this later if we have mutliple messes
  //   type: mess,
  //   required: true,
  // },
  readBy: {
    //array of user ids who have read the notification
    type: [Schema.Types.ObjectId],
    ref: "user",
    required: true,
  },
});

export default mongoose.model("Notifications", notification);
