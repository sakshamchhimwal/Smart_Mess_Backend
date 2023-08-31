require("dotenv").config();
import { JWTLoadData, UserData } from "../Interface/interfaces";
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../Interface/interfaces";

export const Authenticate = () => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        const token = req.cookies.token;
        if (!token) {
            res.status(404).send("Token not found");
        } else {
            try {
                const data: JWTLoadData = verify(token, process.env.JWT_SECRET!) as JWTLoadData;
                req.user = data.user;
                next();
            } catch (err) {
                console.log(err);
                res.status(403).send("Invalid Token");
            }
        }
    }
}