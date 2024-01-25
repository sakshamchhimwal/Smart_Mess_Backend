import mongoose, { Schema } from "mongoose";

const Suggestions = new Schema({
	messId: { type: Schema.Types.ObjectId, ref: "mess", required: true },
	user: { type: Schema.Types.ObjectId, ref: "users", required: true },
	suggestionType: { type: Schema.Types.String, required: true },
	suggestion: Schema.Types.String,
	upvotes: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: "users",
			},
		],
		default: [],
	},
	downvotes: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: "users",
			},
		],
		default: [],
	},
	createdAt: {
		type: Schema.Types.Date,
		required: true,
	},
});

export default mongoose.model("suggestions", Suggestions);