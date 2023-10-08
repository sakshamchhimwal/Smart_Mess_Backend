import user from "../models/user";
import actualFeedback from "../models/actualFeedback";
import feedbackForm from "../models/feedbackForm";
import notificationToken from "../models/notifications";
import notifications from "../models/notifications";
import { CustomRequest } from "../Interface/interfaces";
import express, { Request, Response, NextFunction } from "express";
import User_Schema from "../models/user";
import { GoogleUserResult, JWTLoadData, userResult } from "../Interface/interfaces";
import menuTable from "../models/menuTable";
import mealItem from "../models/mealItem";
import foodItemRatings from "../models/foodItemRatings";
import { getItemRatings } from "./admin.controller";
import mongoose from "mongoose";


export const timeTableHandler = (req: any, res: Response, next: NextFunction) => {
	let data = req.user;
	try {
		let currUser: userResult = <userResult>(<unknown>user.findOne({ Email: data.email }));
		if (!currUser) {
			res.status(404).send("User Not Found");
		} else {
			let eatMess = currUser.Eating_Mess;
			let allTimeTable = menuTable.find({ Mess: eatMess });
			res.send(200).send(allTimeTable);
		}
	} catch (error) {
		res.status(501).send("Some Error Occured");
		console.log(error);
	}
};


const getMenuItems = async (mealItems: any[]) => {
	let menuItems: any[] = [];
	for (let i = 0; i < mealItems.length; i++) {
		let mealDetails = await mealItem.findById(mealItems[i]);
		if (mealDetails) {
			menuItems.concat({ "Name": mealDetails.Name, "Image": mealDetails.Image });
		}
	}
	return menuItems;
}


const makeMenuDay = (allTimeTable: any[]) => {
	let res: any[] = [];
	for (let i = 0; i < allTimeTable.length; i++) {
		let items = getMenuItems(allTimeTable[i]);
		res.concat({ "MealType": allTimeTable[i].MealType, "Items": items.toString() });
	}
	return res;
}

export const userTimeTable = async (req: any, res: Response, next: NextFunction) => {
	let data = req.user;
	try {
		let currUser: userResult = await <userResult>(<unknown>user.findOne({ Email: data.email }));
		if (!currUser) {
			res.status(404).send("User not found");
		} else {
			let userMess = currUser.Eating_Mess;
			let allTimeTable = await menuTable.find({ Mess: userMess });
			return makeMenuDay(allTimeTable);
		}
	} catch (e) {
		res.send("Unexpected Error").status(501);
		console.log(e);
	}
}


export const userDetails = async (req: any, res: Response, next: NextFunction) => {
	let data = req.user;
	try {
		let currUser: userResult = await <userResult>(<unknown>user.findOne({ Email: data.email }));
		if (!currUser) {
			res.status(404).send("User Not Found");
		} else {
			res.send(currUser).status(200);
		}
	} catch (error) {
		res.status(501).send("Some Error Occured");
		console.log(error);
	}
};


const __initItemRating = async (mess: any, foodItem: string) => {
	console.log(mess);
	await foodItemRatings.create({
		Mess: new mongoose.Types.ObjectId(mess),
		FoodItem: new mongoose.Types.ObjectId(foodItem)
	});
}

export const giveRating = async (req: any, res: Response) => {
	let data = req.user;
	try {
		let currUser = await user.findOne({ Email: data.email });
		if (!currUser) {
			return res.status(404).send("User Not Found");
		} else {
			console.log(req.body);
			let foodId = req.body.foodId;
			let eatingMess = currUser.Eating_Mess;
			let rating = req.body.rating;
			let currItemRating = await foodItemRatings.findOne({ FoodItem: foodId, Mess: eatingMess });
			if (!currItemRating) {
				await __initItemRating(eatingMess?.toString(), foodId);
			}
			currItemRating = await foodItemRatings.findOne({ FoodItem: foodId, Mess: eatingMess });
			console.log(currItemRating);
			let currRating = currItemRating?.Rating;
			let currNumReviewes = currItemRating?.NumberOfReviews;
			let newRating = ((currRating! * currNumReviewes!) + rating) / (currNumReviewes! + 1);
			await foodItemRatings.findOneAndUpdate({ FoodItem: foodId, Mess: eatingMess }, { Rating: newRating, NumberOfReviews: currNumReviewes! + 1 });
			return res.send("Updated").status(200);
		}
	} catch (err) {
		// console.log(err);
		return res.send("Unexpected error occured").status(501);
	}
}

export const getLatestUpdates = async (req: any, res: Response) => {
	try {
		const currUser = await user.findOne({ Email: req.user.email });
		//yet to be implemented
	} catch (err) {
		console.log(err);
		res.status(501).send("Some Error Occured");
	}
};


export const webAddNotificationTokenHandler = async (req: Request, res: Response) => {
	const { notification_token, Email } = req.body;
	if (!notification_token || !Email) return res.status(400).send("Invalid Request");
	try {
		//check if token already exists with email and platform - web if yes then update it else create new
		const token = await notificationToken.findOneAndUpdate({ Email: Email, Platform: "web" }, { Token: notification_token }, { new: true, upsert: true });
		return res.status(200).send(token);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Some Error Occured");
	}
};

export const getAllNotifications = async (req: any, res: Response) => {
	try {
		const currUser: any = await user.findOne({ Email: req.user.email });
		const allNotifications = await notifications.find();

		const announcementResponse: any = allNotifications.map(notification => ({
			_id: notification._id,
			Title: notification.Title,
			Message: notification.Message,
			Date: notification.Date,
			Attachment: notification.Attachment,
			read: notification.readBy.includes(currUser._id),
			messageType: "announcement",
			sortParam: notification.Date
		}));
		const allFeedbacks = await feedbackForm.find();
		//first check whether the user has submitted the feedback or not
		//if yes then don't show the feedback form
		//also check whether the feedback form is active or not
		//the feedback form is active if the current date is between the start and end date
		let feedbackResponse: any = await Promise.all(allFeedbacks.map(async (feedback) => {
			if (Date.now() > feedback.FormEndDate.getTime()) return null;
			if (await actualFeedback.findOne({ Email: currUser.Email, FormID: feedback._id })) return null;
			return {
				_id: feedback._id,
				Title: feedback.Title,
				Description: feedback.Description,
				FormStartDate: feedback.FormStartDate,
				FormEndDate: feedback.FormEndDate,
				messageType: "feedback", // render
				sortParam: feedback.FormStartDate
			};
		}));
		const response = announcementResponse.concat(feedbackResponse);
		response.sort((a: any, b: any) => {
			return b.sortParam - a.sortParam;
		});
		return res.status(200).send(response);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Some Error Occurred");
	}
};



export const makeRead = async (req: any, res: Response) => {
	try {
		// const email = ('user' in req) ? req.user.email : null;
		const currUser: any = await user.findOne({ Email: req.user.email });
		const notifId = req.body.notifId;
		const notif = await notifications.findOne({ _id: notifId });
		if (notif) {
			await notifications.findByIdAndUpdate(notif._id, { $addToSet: { readBy: [new mongoose.Types.ObjectId(currUser._id)] } });
			return res.send("Read").status(200);
		} else {
			return res.send("Unexpected Error").status(404);
		}
	} catch (err) {
		console.log(err);
		return res.status(501).send("Some error occured");
	}
}

export const submitFeedback = async (req: any, res: Response) => {
	try {
		const currUser = await user.findOne({ Email: req.user.email });
		const { FormID, BreakfastRating, LunchRating, DinnerRating, SnacksRating, Feedback, MessServiceRating, HygieneRating } = req.body;
		await actualFeedback.create({
			Email: currUser?.Email,
			FormID: FormID,
			BreakfastRating: BreakfastRating,
			LunchRating: LunchRating,
			DinnerRating: DinnerRating,
			SnacksRating: SnacksRating,
			Feedback: Feedback,
			MessServiceRating: MessServiceRating,
			HygieneRating: HygieneRating
		});
		res.send("Feedback Submitted").status(200);
	} catch (err) {
		console.log(err);
		res.status(501).send("Some Error Occured");
	}
}
