const { default: mongoose, Schema, SchemaTypes } = require("mongoose");

const meal_item = new Schema({ name: String });

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

module.exports = mongoose.model("Menu_Table", menu_table);
