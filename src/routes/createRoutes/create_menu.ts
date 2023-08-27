require("dotenv").config();
import express from "express";
import menu_table from "../../models/menu_table";
import meal_item from "../../models/meal_item";
import { NextFunction, Request, Response } from "express";
import { MealRequest, UserData } from "../../Interface/interfaces";
import { verfiyToken } from "../../services/verifyToken";

export const create_menu = express.Router();

create_menu.post("/create_menu", async (req: MealRequest, res: Response, next: NextFunction) => {
  try {
    // Verification Layer Yet to be added
    let user: UserData = verfiyToken(req, res);
    if (user.role === -1) {
      res.send("Unauthorized Access").status(401);
    }
    if (user.role != 2) {
      res.status(401).send("Unauthorized Acess");
    }
    let items = req.body.items.split(",");
    let menu_item: any[] = [];
    items.forEach(async (item: string) => {
      let newItem = await meal_item.create({
        name: item,
      });
      menu_item.push(newItem);
    });
    let newMenu = await menu_table.create({
      Day: req.body.day,
      MealType: req.body.mealType,
      Meal_Items: menu_item,
    });
    res.status(200).send("Added Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Some Error Occured");
  }
});
