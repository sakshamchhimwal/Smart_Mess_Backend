import { NextFunction, Response } from "express";
import UserModel from "../../models/user";
import createHttpError from "http-errors";
import SuggestionsModel from "../../models/suggestions";

export const getSuggestions = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	const loggedInUserData = req.user;
	try {
		const currUser = await UserModel.findOne({
			Email: loggedInUserData.email,
		});
		if (!currUser) {
			return next(createHttpError(403, "Unauthorized"));
		}
		if (currUser) {
			const messId = currUser.Eating_Mess;
			const currPage = req.query.page;
			const LIMIT = 10;
			const paginatedSuggestions = await SuggestionsModel.find({
				messId: messId,
				userId: currUser._id,
			})
				.skip((currPage - 1) * LIMIT)
				.limit(LIMIT)
				.populate("userId", "upvotes", "downvotes")
				.exec();
			if (paginatedSuggestions.length > 0) {
				return res.send({
					suggestions: paginatedSuggestions,
					hasNext: true,
				});
			}
			return res.send({ suggestions: [], hasNext: false }).status(204);
		}
	} catch (err) {
		console.log(err);
		return next(createHttpError(500, "Internal Server Error"));
	}
};

export const postSuggestion = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	const loggedInUserData = req.user;
	try {
		const currUser = await UserModel.findOne({
			Email: loggedInUserData.email,
		});
		if (!currUser) {
			return next(createHttpError(403, "Unauthorized"));
		}
		const messId = currUser.Eating_Mess;
		const newSuggestion = req.body;
		// console.log(req.body);
		const addSuggestion = await SuggestionsModel.create({
			messId,
			userId: currUser._id,
			...newSuggestion,
			createdAt: Date.now()
		});
		if (addSuggestion) {
			return res
				.send({ Message: "Suggestion added successfully" })
				.status(200);
		} else {
			return res
				.send({ Message: "Failure suggestion not added" })
				.status(400);
		}
	} catch (err) {
		console.log(err);
		return next(createHttpError(500, "Internal Server Error"));
	}
};

export const patchSuggestion = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	const loggedInUserData = req.user;
	try {
		const currUser = await UserModel.findOne({
			Email: loggedInUserData.email,
		});
		if (!currUser) {
			return next(createHttpError(403, "Unauthorized"));
		}

		const suggestionId = req.body.suggestionId;
		const newSuggestion = req.body.suggestion;

		const updateSuggestion = await SuggestionsModel.updateOne(
			{
				_id: suggestionId,
				userId: currUser._id,
			},
			{
				$set: {
					suggestion: newSuggestion,
				},
			}
		);

		if (updateSuggestion.modifiedCount > 0) {
			res.send({}).status(204);
		} else {
			res.send({ message: "Suggestion Not Found" }).status(404);
		}
	} catch (err) {
		console.error(err);
		next(createHttpError(500, "Internal Server Error"));
	}
};

export const deleteSuggestion = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	const loggedInUserData = req.user;
	try {
		const currUser = await UserModel.findOne({
			Email: loggedInUserData.email,
		});
		if (!currUser) {
			return next(createHttpError(403, "Unauthorized"));
		}

		const suggestionId = req.query.suggestionId;
		const deletedSuggestion = await SuggestionsModel.deleteOne({
			_id: suggestionId,
			userId: currUser._id,
		});

		if (deletedSuggestion.deletedCount > 0) {
			res.send({ message: "Sugestion deleted successfully" }).status(200);
		} else {
			res.send({ message: "Suggestion Not Found" }).status(404);
		}
	} catch (err) {
		console.error(err);
		next(createHttpError(500, "Internal Server Error"));
	}
};
