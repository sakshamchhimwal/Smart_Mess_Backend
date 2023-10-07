import mongoose, { Schema } from "mongoose";


const itemRatings = new Schema({
    Mess: Schema.Types.ObjectId,
    FoodItem: Schema.Types.ObjectId,
    Rating: {
        type: Number,
        default: 0
    },
    NumberOfReviews: {
        type: Number,
        default: 0
    }
})

export default mongoose.model("Item Ratings", itemRatings);