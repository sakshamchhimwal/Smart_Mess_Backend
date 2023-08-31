require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import User_Schema from "../../../../models/user";
import { GoogleUserResult, userResult } from "../../../../Interface/interfaces";
import menuTable from "../../../../models/menuTable";
import feedback from "../../../../models/feedback";
export const getUserFeedback = express.Router();

getUserFeedback.get(
  "/user/dashboard/feedback",
  (req: Request, res: Response, next: NextFunction) => {
    //verfication;
    //add verification layer here
    let data: GoogleUserResult = <GoogleUserResult>(<unknown>"");
    try {
      let user: userResult = <userResult>(<unknown>User_Schema.findOne({ Email: data.email }));
      if (!user) {
        res.status(404).send("User Not Found");
      } else {
        let userId = user._id;
        let userFeedbacks = feedback.find({ UserID: userId });
        res.send(userFeedbacks).status(200);
      }
    } catch (error) {
      res.status(501).send("Some Error Occured");
      console.log(error);
    }
  }
);
