const { default: mongoose, Schema } = require("mongoose");

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
  Last_Login: {
    type: Date,
  },
});

module.exports = mongoose.model("User_Schema", User);
