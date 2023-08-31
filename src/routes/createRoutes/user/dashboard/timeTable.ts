require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import User_Schema from "../../../../models/user";
import { GoogleUserResult, userResult } from "../../../../Interface/interfaces";
import menuTable from "../../../../models/menuTable";
export const getTimeTable = express.Router();

getTimeTable.get("/user/dashboard/timetable", (req: Request, res: Response, next: NextFunction) => {
  //verfication;
  //add verification layer here
  let data: GoogleUserResult = <GoogleUserResult>(<unknown>"");
  try {
    let user: userResult = <userResult>(<unknown>User_Schema.findOne({ Email: data.email }));
    if (!user) {
      res.status(404).send("User Not Found");
    } else {
      let eatMess = user.Eating_Mess;
      let allTimeTable = menuTable.find({ Mess: eatMess });
      res.send(200).send(allTimeTable);
    }
  } catch (error) {
    res.status(501).send("Some Error Occured");
    console.log(error);
  }
});
