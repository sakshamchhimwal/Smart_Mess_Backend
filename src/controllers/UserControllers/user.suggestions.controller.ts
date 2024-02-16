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
				.populate("userId", "Username Image")
				.populate("upvotes downvotes", "Username")
				.exec();
			if (paginatedSuggestions.length > 0) {
				return res.status(200).send({
					suggestions: paginatedSuggestions,
					hasNext: paginatedSuggestions.length === LIMIT,
				});
			}
			return res.status(204).send({ suggestions: [], hasNext: false });
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
		console.log(req.body);
		const addSuggestion = await SuggestionsModel.create({
			messId,
			userId: currUser._id,
			...newSuggestion,
			createdAt: Date.now(),
		});
		if (addSuggestion) {
			return res
				.status(200)
				.send({ Message: "Suggestion added successfully" });
		} else {
			return res
				.status(400)
				.send({ Message: "Failure suggestion not added" });
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
			res.status(204).send({});
		} else {
			res.status(404).send({ message: "Suggestion Not Found" });
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
			res.status(200).send({ message: "Sugestion deleted successfully" });
		} else {
			res.status(404).send({ message: "Suggestion Not Found" });
		}
	} catch (err) {
		console.error(err);
		next(createHttpError(500, "Internal Server Error"));
	}
};
