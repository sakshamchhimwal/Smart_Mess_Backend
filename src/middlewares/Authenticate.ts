require("dotenv").config();
import { JWTLoadData, UserData } from "../Interface/interfaces";
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { createSession } from "../services/createSession";
import { CustomRequest } from "../Interface/interfaces";
import { Authorize } from "./Authorize";
import { head } from "axios";

export const Authenticate = () => {
    return (req: any, res: Response, next: NextFunction) => {
        // #token Authorization header bearer
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) {
            res.status(404).send("Token not found");
        } else {
            try {
                const data: JWTLoadData = verify(token, process.env.JWT_SECRET!) as JWTLoadData;
                req.user = data.user;
                next();
            } catch (err: any) {
                console.log(err);
                //session expired
                if (err.name === "TokenExpiredError") {
                    const { email, role, time } = err.payload.user;
                    const payload: JWTLoadData = {
                        user: {
                            email,
                            role,
                            time: Date.now(),
                        },
                    };
                    const token = createSession(payload);
                    res.status(440).send({ token });
                } else {
                    res.status(401).send("Unauthorized Access");
                }
            }
        }
    }
}