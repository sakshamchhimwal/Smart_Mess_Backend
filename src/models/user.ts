import mongoose, { Schema } from "mongoose";
const User = new Schema({
  Username: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    unique: true,
    required: true,
  },
  Phone_Number: {
    type: Number,
    required: true,
    length: 10,
  },
  Role: {
    type: Number, //we will assign the role in the backend so it is not required
  },
  First_Name: {
    type: String,
    required: true,
  },
  Last_Name: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
  },
  Last_Login: {
    type: Date,
  },
});

export default mongoose.model("User_Model", User);
