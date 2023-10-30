import mongoose, { Schema } from "mongoose";

const date = new Date(Date.now());

const makeDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

const user_food_review = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    date: {
        type: Date,
        default: makeDate(date)
    },
    ratings: Schema.Types.Array
})

export default mongoose.model("UserFoodReview", user_food_review);