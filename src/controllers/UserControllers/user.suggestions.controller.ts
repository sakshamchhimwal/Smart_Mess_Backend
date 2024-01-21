import { NextFunction, Response } from "express"
import UserModel from "../../models/user";
import createHttpError from "http-errors";
import MessModel from "../../models/mess";

export const getSuggestions = async (req: any, res: Response, next: NextFunction) => {
    const loggedInUserData = req.user;
    try {
        const currUser = await UserModel.findOne({ Email: loggedInUserData.email });
        if (!currUser) {
            return next(createHttpError(403, "Unauthorized"));
        }
        if (currUser) {
            const currUserMess = currUser.Eating_Mess;
            const allSuggestions = await MessModel.findById({ _id: currUserMess, "suggestions.userId": currUser._id });
            return res.send({ "userSuggestions": allSuggestions?.suggestions }).status(200);
        }
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, "Internal Server Error"));
    }
}

export const postSuggestion = async (req: any, res: Response, next: NextFunction) => {
    const loggedInUserData = req.user;
    try {
        const currUser = await UserModel.findOne({ Email: loggedInUserData.email });
        if (!currUser) {
            return next(createHttpError(403, "Unauthorized"));
        }
        const currUserMess = currUser.Eating_Mess;
        const newSuggestion = req.body.newSuggestion;
        const updatedSuggestion = await MessModel.findOneAndUpdate(
            { _id: currUserMess },
            { $push: { suggestions: newSuggestion } }
        );
        if (updatedSuggestion?.isModified) {
            return res.send({ message: "Success" }).status(201);
        }
        else {
            return res.send({ error: "Authorization Failed" }).status(403);
        }
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, "Internal Server Error"));
    }
}

export const patchSuggestion = async (req: any, res: Response, next: NextFunction) => {
    const loggedInUserData = req.user;
    try {
        const currUser = await UserModel.findById(loggedInUserData.id);
        if (!currUser) {
            return next(createHttpError(403, "Unauthorized"));
        }

        const suggestionId = req.body.suggestionId;
        const newSuggestion = req.body.suggestion;

        const updatedDocument = await MessModel.updateOne(
            {
                _id: currUser.Eating_Mess,
                "suggestions.suggestionId": suggestionId,
                "suggestions.userId": currUser._id
            },
            { $set: { "suggestions.$.suggestion": newSuggestion } }
        );

        if (updatedDocument.modifiedCount > 0) {
            res.send({}).status(204);
        } else {
            res.send({ message: "Suggestion Not Found" }).status(404);
        }
    } catch (err) {
        console.error(err);
        next(createHttpError(500, "Internal Server Error"));
    }
};


export const deleteSuggestion = async (req: any, res: Response, next: NextFunction) => {
    const loggedInUserData = req.user;
    try {
        const currUser = await UserModel.findById(loggedInUserData.id);
        if (!currUser) {
            return next(createHttpError(403, "Unauthorized"));
        }

        const suggestionId = req.body.suggestionId;
        const updatedDocument = await MessModel.updateOne(
            {
                _id: currUser.Eating_Mess,
                "suggestions.suggestionId": suggestionId,
                "suggestions.userId": currUser._id
            },
            { $pull: { suggestions: { suggestionId: suggestionId } } }
        );

        if (updatedDocument.modifiedCount > 0) {
            res.send({}).status(204);
        } else {
            res.send({ message: "Suggestion Not Found" }).status(404);
        }
    } catch (err) {
        console.error(err);
        next(createHttpError(500, "Internal Server Error"));
    }
};

