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
    type: mess,
    required: true,
  },
});

export default mongoose.model("Complaint", complaint);
