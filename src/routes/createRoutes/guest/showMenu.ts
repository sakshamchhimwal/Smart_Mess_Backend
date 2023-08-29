import express, { Request, Response, NextFunction } from "express";
import menu_table from "../../../models/menuTable";
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
    try {
      let currMess = await mess.findOne({ messName: req.body.mess });
      if (!currMess) {
        res.status(404).send("Mess Not Found");
      }
      let day: number = req.body.date.getDay();
      let time: number = req.body.date.getHours();
      if (time > 22 && time < 10) {
        res
          .status(400)
          .send(menu_table.findOne({ Mess: currMess } && { MealType: 1 } && { Day: day }));
      }
      if (time > 10 && time < 15) {
        res
          .status(400)
          .send(menu_table.findOne({ Mess: currMess } && { MealType: 2 } && { Day: day }));
      }
      if (time > 15 && time < 18) {
        res
          .status(400)
          .send(menu_table.findOne({ Mess: currMess } && { MealType: 3 } && { Day: day }));
      }
      if (time > 18 && time < 22) {
        res
          .status(400)
          .send(menu_table.findOne({ Mess: currMess } && { MealType: 4 } && { Day: day }));
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Unexpected Error");
    }
  }
);
