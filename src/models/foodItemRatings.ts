import mongoose, { Schema } from "mongoose";

const itemRatings = new Schema({
	Mess: { type: Schema.Types.ObjectId, ref: "messes" },
	FoodItem: { type: Schema.Types.ObjectId, ref: "fooditems" },
	Rating: {
		type: Number,
		default: 0,
	},
	NumberOfReviews: {
		type: Number,
		default: 0,
	},
});

export default mongoose.model("Item Ratings", itemRatings);
