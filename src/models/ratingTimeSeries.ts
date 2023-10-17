import mongoose, { Schema } from "mongoose";

const ratingTimeSeries = new Schema({
    Date: {
        type: Date
    },
    FoodItemId: {
        type: Schema.Types.ObjectId
    },
    Rating: {
        type: Number
    }
});

export default mongoose.model("RatingTimeSeries", ratingTimeSeries);
