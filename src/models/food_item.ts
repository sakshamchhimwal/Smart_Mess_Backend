import mongoose, { Schema } from "mongoose";
const allergen = new Schema({ name: String });

const food_item = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
  },
  Allergens: {
    type: [allergen],
  },
  Calories: {
    type: Number,
  },
  Category: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Food_Item", food_item);
