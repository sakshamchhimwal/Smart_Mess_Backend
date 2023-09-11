import mongoose, { Schema } from "mongoose";
import mess from "./mess";
const complaint = new Schema({
  UserID: {
    type: String,
    required: true,
  },
  Complaint: {
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

export default mongoose.model("Complaint", complaint);
