import express, { Request, Response, NextFunction } from "express";
import menu_table from "../../../models/menuTable";
import mess from "../../../models/mess";
export const guestTimeTable = express.Router();

interface TimeTableReq extends Request {
  body: {
    mess: string;
  };
}

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
