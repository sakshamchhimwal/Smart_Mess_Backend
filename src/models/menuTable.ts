import mongoose, { Schema } from "mongoose";
import meal_item from "./mealItem";
import mess from "./mess";

const menu_table = new Schema({
  Day: {
    type: String,
    required: true,
  },
  MealType: {
    type: Number,
    required: true,
  },
  Meal_Items: {
    type: [meal_item],
  },
  Mess: {
    type: mess,
    required: true,
  },
});

export default mongoose.model("MenuTable", menu_table);
