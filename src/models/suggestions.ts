import mongoose, { Schema } from "mongoose";

const Suggestions = new Schema({
  messId: { type: Schema.Types.ObjectId, ref: "mess", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  suggestionTitle: { type: Schema.Types.String, required: true },
  suggestionType: { type: Schema.Types.String, required: true },
  suggestion: Schema.Types.String,
  image: Schema.Types.String,
  status: {
    type: Schema.Types.String,
    enum: ["open", "closed"],
    default: "open",
  },
  upvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
      default: [],
    },
  ],
  downvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
      default: [],
    },
  ],

  children: [
    {
      id: { type: Schema.Types.ObjectId, required: true },
      upvotes: [
        {
          type: Schema.Types.ObjectId,
          ref: "users",
          default: [],
        },
      ],
      downvotes: [
        {
          type: Schema.Types.ObjectId,
          ref: "users",
          default: [],
        },
      ],
      comment: Schema.Types.String,
    },
  ],

  createdAt: {
    type: Schema.Types.Date,
    required: true,
  },
});

export default mongoose.model("suggestions", Suggestions);
