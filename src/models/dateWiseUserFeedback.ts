import dayjs from "dayjs";
import mongoose, { Schema } from "mongoose";
import userModel from "../models/user"
import foodItemsModel from "../models/mealItem"

const user_food_review = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: userModel.modelName
    },
    date: {
        type: Date,
        default: dayjs().format('YYYY-MM-DD')
    },
    ratings: [
        {
            foodId: {
                type: Schema.Types.ObjectId,
                ref: foodItemsModel.modelName,
                require: "true"
            },
            review: Schema.Types.String,
            rating: Schema.Types.Number
        }
    ],
})

export default mongoose.model("UserFoodReview", user_food_review);