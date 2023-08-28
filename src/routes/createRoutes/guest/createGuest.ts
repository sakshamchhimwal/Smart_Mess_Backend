require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
export const createGuestUserFeedback = express.Router();
import guestFeedBack from "../../../models/guestFeedBack";
import mess from "../../../models/mess";
import { GuestBody } from "../../../Interface/interfaces";

createGuestUserFeedback.post(
  "/createGuest",
  async (req: GuestBody, res: Response, next: NextFunction) => {
    try {
      if (!req.body.name) {
        res.status(401).send("Provide Name");
      }
      if (!req.body.email) {
        res.status(401).send("Provide Email Address");
      }
      let guest = await guestFeedBack.findOne({ Email: req.body.email });
      if (guest) {
        res.status(400).send({ error: "User Already Exists" });
      } else {
        let eatMess = await mess.findOne({ messName: req.body.mess });
        if (!eatMess) {
          res.status(400).send({ error: "Mess Does Not Exist" });
        } else {
          guest = await guestFeedBack.create({
            Name: req.body.name,
            Email: req.body.email,
            Feedback: req.body.feedback,
            Image: req.body.image,
            Date: Date.now(),
            Mess: eatMess,
          });
        }
      }
      res.status(200).send("Feedback Noted");
    } catch (error) {
      console.log(error);
      res.status(500).send("Some Error Occured");
    }
  }
);
