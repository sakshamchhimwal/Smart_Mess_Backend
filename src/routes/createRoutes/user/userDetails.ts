require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import User_Schema from "../../../models/user";
import { GoogleUserResult, userResult } from "../../../Interface/interfaces";
import feedback from "../../../models/feedback";
import notifications from "../../../models/notifications";
export const getUserDetails = express.Router();

getUserDetails.get("/user/dashboard", (req: Request, res: Response, next: NextFunction) => {
  //verfication;
  //add verification layer here
  let data: GoogleUserResult = <GoogleUserResult>(<unknown>"");
  try {
    let user: userResult = <userResult>(<unknown>User_Schema.findOne({ Email: data.email }));
    if (!user) {
      res.status(404).send("User Not Found");
    } else {
      res.send(user).status(200);
    }
  } catch (error) {
    res.status(501).send("Some Error Occured");
    console.log(error);
  }
});
