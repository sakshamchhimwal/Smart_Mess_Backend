import mongoose, { Schema } from "mongoose";

import meal_item from "./meal_item";
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
});

export default mongoose.model("MenuTable", menu_table);
