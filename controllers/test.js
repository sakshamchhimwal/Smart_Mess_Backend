const food_item = require("../models/food_item");

const addItem = async (req, res) => {
//   console.log(req.body);
  const { Name, Image, Allergens, Calories, Category } = req.body;
  try {
    const item = await food_item.create({
      Name,
      Image,
      Allergens,
      Calories,
      Category,
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.addItem = addItem;
