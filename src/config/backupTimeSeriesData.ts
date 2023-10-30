import foodItemRatings from "../models/foodItemRatings"
import menuTable from "../models/menuTable";
import ratingTimeSeries from "../models/ratingTimeSeries";


const dayMap = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

const currDate = new Date(Date.now());
const currDay = currDate.getUTCDay();
const currDateString = currDate.toDateString();

const getDayTimeTable = async () => {
    const foodItems = await menuTable.find({ Day: dayMap[currDay - 1] });
    let dayItemsArr: any[] = [];
    foodItems.forEach((ele) => {
        ele.Meal_Items.forEach((eleId) => {
            dayItemsArr.push(eleId);
        })
    })
    return dayItemsArr;
}

const backup = async () => {
    const ratings = await foodItemRatings.find();
    const dayItemsToBeBackedUp = await getDayTimeTable();
    ratings.forEach(async (ele) => {
        if (dayItemsToBeBackedUp.includes(ele.FoodItem)) {
            await ratingTimeSeries.create({
                Date: currDateString,
                FoodItemId: ele.FoodItem,
                Rating: ele.Rating,
                NoOfReviews: ele.NumberOfReviews
            })
        }
    });
    console.log("BackedUp Rating")
}

export default backup;