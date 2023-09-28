import mongoose, { Schema } from "mongoose";

const menu_table = new Schema({
  Day: {
    type: String,
    required: true,
  },
  MealType: {
    type: String,
    required: true,
  },
  Meal_Items: {
    type: [Schema.Types.ObjectId],
    ref: "meal_item",
    required: true,
  },
  Mess: {
    type: Schema.Types.ObjectId,
    ref: "mess",
    required: true,
  },
});

export default mongoose.model("MenuTable", menu_table);
