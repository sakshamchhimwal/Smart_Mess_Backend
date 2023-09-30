import { JWTLoadData, UserData } from "../Interface/interfaces";
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../Interface/interfaces";

export const Authorize = () => {
    return (req: any, res: Response, next: NextFunction) => {
        console.log("Authorizing...")
        const role = req.user.role;
        console.log(role);
        const url_role = req.url.split('/')[1];
        // console.log(role, url_role);
        if (role === url_role) {
            console.log("Successfully Authorized...")
            next();
        }
        else {
            res.status(401).send("Unauthorized Access");
        }
    }
}





