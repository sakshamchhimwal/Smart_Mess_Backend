import { NextFunction, Response } from "express"
import UserModel from "../../models/user";
import createHttpError from "http-errors";
import MessModel from "../../models/mess";

export const getAllSuggestions = async (req: any, res: Response, next: NextFunction) => {
    const loggedInUserData = req.user;
    try {
        const currUser = await UserModel.findOne({ Email: loggedInUserData.email });
        if (!currUser) {
            return next(createHttpError(403, "Unauthorized"));
        }
        if (currUser) {
            const currUserMess = currUser.Eating_Mess;
            const allSuggestions = await MessModel.findById({ _id: currUserMess });
            return res.send({ "userSuggestions": allSuggestions?.suggestions }).status(200);
        }
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, "Internal Server Error"));
    }
}