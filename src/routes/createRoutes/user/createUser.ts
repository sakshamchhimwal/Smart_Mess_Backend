require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const create_user = express.Router();
import User_Schema from "../../../models/user_model";
import { JWTLoadData } from "../../../Interface/interfaces";

create_user.post("/create_user", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user = await User_Schema.findOne({ Username: req.body.Username });
    if (user) {
      res.status(400);
      res.send({ error: "User Already Exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.pass, salt);
      user = await User_Schema.create({
        Username: req.body.Username,
        Password: secPass,
        Email: req.body.Email,
        Phone_Number: req.body.Phone_Number,
        Role: req.body.Role,
        First_Name: req.body.First_Name,
        Last_Name: req.body.Last_Name,
        Last_Login: Date.now(),
      });
      const data: JWTLoadData = {
        user: {
          id: user.id,
          email: user.Email,
          role: user.Role!,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_KEY!);
      res.send({ authToken });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Some Error Occured");
  }
});
