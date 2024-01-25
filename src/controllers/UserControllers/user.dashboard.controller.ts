import { NextFunction, Response } from "express";
import UserModel from "../../models/user";
import createHttpError from "http-errors";
import SuggestionModel from "../../models/suggestions";

export const getAllSuggestions = async (
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
			const currUserMess = currUser.Eating_Mess;
			const currPage = req.query.page;
			const LIMIT = 10;
			const paginatedSuggestions = await SuggestionModel.find(
				{
					messId: currUserMess,
				},
				{ _id: -1 }
			)
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

export const voteSuggestion = async (
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
		const currentSuggestion = await SuggestionModel.findOne({
			_id: suggestionId,
			messId: currUser.Eating_Mess,
		});
		if (currentSuggestion) {
			if (req.body.upvote === true) {
				const hasVoted = currentSuggestion.upvotes.includes(
					currUser._id
				);
				if (!hasVoted) {
					await currentSuggestion.updateOne({
						$addToSet: {
							upvotes: currUser._id,
						},
					});
				} else {
					await currentSuggestion.updateOne({
						$pull: {
							upvotes: currUser._id,
						},
					});
				}
			} else {
				const hasVoted = currentSuggestion.downvotes.includes(
					currUser._id
				);
				if (hasVoted) {
					await currentSuggestion.updateOne({
						$addToSet: {
							downvotes: currUser._id,
						},
					});
				} else {
					await currentSuggestion.updateOne({
						$pull: {
							downvotes: currUser._id,
						},
					});
				}
			}
			await currentSuggestion.save();
			if (currentSuggestion.isModified()) {
				return res
					.send({
						message: "Voted Successfully",
						upvotes: currentSuggestion.upvotes,
						downvotes: currentSuggestion.downvotes,
					})
					.status(200);
			} else {
				return res
					.send({
						message: "Vote Unsuccessful",
					})
					.status(400);
			}
		} else {
			return res
				.send({ message: "Suggestion for user does not exist" })
				.status(404);
		}
	} catch (err) {
		console.log(err);
		next(createHttpError(500, "Internal Server Error"));
	}
};
