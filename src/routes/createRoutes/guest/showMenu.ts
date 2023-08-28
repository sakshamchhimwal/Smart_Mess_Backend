import express, { Request, Response, NextFunction } from "express";
import menu_table from "../../../models/menu_table";
import mess from "../../../models/mess";
import { OngoingMealRequest, TimeTableReq } from "../../../Interface/interfaces";
export const guestTimeTable = express.Router();
export const currentMeal = express.Router();

guestTimeTable.get(
  "/guestTimeTable",
  async (req: TimeTableReq, res: Response, next: NextFunction) => {
    try {
      let currMess = await mess.findOne({ messName: req.body.mess });
      if (!currMess) {
        res.status(404).send("Mess Not Found");
      } else {
        let meals: any = await menu_table.find({ Mess: currMess });
        res.send(meals).status(200);
      }
    } catch (err) {
      console.log(err);
      res.send("Unexpected Error").status(500);
    }
  }
);

currentMeal.get(
  "/guestCurrentMeal",
  async (req: OngoingMealRequest, res: Response, next: NextFunction) => {
    let currMess = await mess.findOne({ messName: req.body.mess });
    if (!currMess) {
      res.status(404).send("Mess Not Found");
    }
    let day: Number = req.body.date.getDay();
    let time: Number = req.body.date.getHours();
    let mealType: Number;
    // if(time>8 && time<)
  }
);
