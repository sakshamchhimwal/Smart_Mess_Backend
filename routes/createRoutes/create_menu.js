require("dotenv").config();
var express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
var router = express.Router();
const Menu_Schema = require("../../models/menu_table");
const Meal_Item = require("../../models/menu_table");
const verifyToken = require("../../middleware/verifyToken");

router.post("/create_menu", verifyToken, async (req, res, next) => {
  try {
    // Verification Layer Yet to be added
    if (req.user.role != 2) {
      res.status(401).send("Unauthorized Acess");
    }
    let items = req.body.items.split(",");
    let menu_item = [];
    items.forEach(async (item) => {
      let newItem = await Meal_Item.create({
        name: item,
      });
      menu_item.push(newItem);
    });
    let newMenu = await Menu_Schema.create({
      Day: res.body.day,
      MealType: res.body.mealType,
      Meal_Items: menu_item,
    });
    res.status(200).send("Added Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Some Error Occured");
  }
});

module.exports = router;
