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



const getDayTimeTable = async () => {
    const currDate = new Date(Date.now());
    const currDay = currDate.getUTCDay();
    const currDateString = currDate.toDateString();
    const foodItems = await menuTable.find({ Day: dayMap[currDay - 1] });
    let dayItemsArr: any[] = [];
    foodItems.forEach((ele) => {
        ele.Meal_Items.forEach((eleId) => {
            dayItemsArr.push(eleId.toString());
        })
    })
    return dayItemsArr;
}

const backup = async () => {
    try {
        const currDate = new Date(Date.now());
        const currDay = currDate.getUTCDay();
        const currDateString = currDate.toDateString();
        const ratings = await foodItemRatings.find();
        const dayItemsToBeBackedUp = await getDayTimeTable();
        // console.log(dayItemsToBeBackedUp);
        ratings.forEach(async (ele) => {
            if (dayItemsToBeBackedUp.includes(ele.FoodItem?.toString())) {
                // console.log({
                //     Date: currDateString,
                //     FoodItemId: ele.FoodItem,
                //     Rating: ele.Rating,
                //     NoOfReviews: ele.NumberOfReviews
                // });
                await ratingTimeSeries.create({
                    Date: currDateString,
                    FoodItemId: ele.FoodItem,
                    Rating: ele.Rating,
                    NoOfReviews: ele.NumberOfReviews
                })
            }
        });
        console.log("BackedUp Rating")
    } catch (err) {
        console.log(err);
        console.log("Backup Failed");
    }
}

export default backup;