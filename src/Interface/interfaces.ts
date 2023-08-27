import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user: {
    role: Number;
    id: Number;
    email: String;
  };
}

export interface JWTLoadData extends JwtPayload {
  user: {
    id: Number;
    email: String;
    role: Number;
  };
}

export interface UserData {
  id: Number;
  email: String;
  role: Number;
}

export interface MealRequest extends Request {
  body: {
    items: string;
    day: any;
    mealType: any;
  };
}
