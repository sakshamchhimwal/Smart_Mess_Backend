import { JWTLoadData, UserData } from "../Interface/interfaces";
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../Interface/interfaces";

export const Authorize = (req: CustomRequest | Request, res: Response, next: NextFunction) => {
    const role= ('user' in req) ? req.user.role : null;
    const url_role = req.url.split('/')[1];
    if (role === url_role) {
        next();
    }
    else {
        res.status(401).send("Unauthorized Access");
    }
};




