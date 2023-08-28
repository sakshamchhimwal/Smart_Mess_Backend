require("dotenv").config();
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWTLoadData, UserData } from "../Interface/interfaces";

export const verfiyToken = (req: Request, res: Response): UserData => {
  const token = req.header("auth-token");
  if (!token) {
    res.send("Unauthorized Access").status(401);
  } else {
    try {
      const data: JWTLoadData = verify(token, process.env.JWT_KEY!) as JWTLoadData;
      return data.user;
    } catch (err) {
      console.log(err);
      res.send("Server Error").status(400);
    }
  }
  return {
    email: "",
    role: -1,
  };
};
