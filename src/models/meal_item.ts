import mongoose, { Schema, mongo } from "mongoose";

const meal_item = new Schema({ name: String });

export default mongoose.model("Meal_Item", meal_item);
