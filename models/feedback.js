const { default: mongoose, Schema } = require("mongoose");

const feedback = new Schema({
  UserID: {
    type: Number,
    required: true,
  },
  Feedback: {
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
});

module.exports = mongoose.model("Feedback", feedback);
