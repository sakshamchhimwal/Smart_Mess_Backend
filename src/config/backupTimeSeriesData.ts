import foodItemRatings from "../models/foodItemRatings"
import ratingTimeSeries from "../models/ratingTimeSeries";


const backup = async () => {
    const ratings = await foodItemRatings.find();
    const currDate = new Date(Date.now());
    const currDateString = currDate.toDateString();
    ratings.forEach((ele) => {
        ratingTimeSeries.create({
            Date: currDateString,
            FoodItemId: ele.FoodItem,
            Rating: ele.Rating
        })
    });
    console.log("BackedUp Rating")
}

export default backup;