require("dotenv").config();
import { JWTLoadData, UserData } from "../Interface/interfaces";
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { createSession } from "../services/createSession";
import { CustomRequest } from "../Interface/interfaces";
import { Authorize } from "./Authorize";
import { head } from "axios";
import user_model from '../models/user';
import Analytics from "../models/analytics";

const updateAnalytics = async (userId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const analyticsRecord = await Analytics.findOne({ date: today });
    if (analyticsRecord) {
        if (!analyticsRecord.visitorIds.includes(userId)) {
            analyticsRecord.visitorIds.push(userId);
            analyticsRecord.uniqueVisitorsCount += 1;
            await analyticsRecord.save();
        }
    } else {
        await Analytics.create({
            date: today,
            uniqueVisitorsCount: 1,
            visitorIds: [userId]
        });
    }
};
export const Authenticate = () => {
    return async (req: any, res: Response, next: NextFunction) => {
        // #token Authorization header bearer
        console.log("Authenticating...")
        let token = req.header("Authorization")?.split(" ")[1];
        //remove last character if it is "
        if (token?.charAt(token.length - 1) === '"') {
            token = token.slice(0, -1);
        }
        // console.log(token);
        if (!token) {
            res.status(501).send({error:"TOKEN_NOT_FOUND"});
        } else {
            try {
                const data: JWTLoadData = verify(token, process.env.JWT_KEY!) as JWTLoadData;
                const user = await user_model.findOne({ Email: data.user.email });
                if (!user) {
                    throw new Error("USER_NOT_FOUND");
                }
    
                // Assuming user model has an _id field which is common with MongoDB/Mongoose
                const userId = user._id.toString();
                req.user = data.user;
                await updateAnalytics(userId);
                console.log("Successfully Authenticated...")
                next();
            } catch (err: any) {
                console.log(err);
                res.status(401).send({error:"UNAUTHORIZED_ACCESS"});
            }
        }
    }
}
