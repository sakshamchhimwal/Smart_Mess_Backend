import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user: {
    role: String;
    email: String;
    time: Number;
  };
}

export interface JWTLoadData extends JwtPayload {
  user: {
    email: String;
    role: String;
    time: Number; // added to make the token dynamic and also to manage sessions
  };
}

export interface UserData {
  email: String;
  role: String;
}

export interface MealRequest extends Request {
  body: {
    items: string;
    day: any;
    mealType: any;
  };
}

export interface GoogleOauthToken {
  access_token: string;
  id_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  scope: string;
}

export interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface GuestBody extends Request {
  body: {
    name: String;
    email: String;
    feedback: String;
    image: String;
    mess: String;
  };
}

export interface OngoingMealRequest extends Request {
  body: {
    mess: String;
    date: Date;
  };
}

export interface TimeTableReq extends Request {
  body: {
    mess: String;
  };
}

export interface userResult {
  _id: String;
  Username: String;
  Password: String;
  Email: String;
  Phone_Number: Number;
  Role: String;
  First_Name: String;
  Last_Name: String;
  Image: String;
  Last_Login: String;
  Eating_Mess: unknown;
}
