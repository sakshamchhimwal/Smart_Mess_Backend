import user from "../models/user";

require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import User_Schema from "../models/user";
import { GoogleUserResult, JWTLoadData, userResult } from "../Interface/interfaces";
import feedback from "../models/actualFeedback";
import menuTable from "../models/menuTable";
import mealItem from "../models/mealItem";
import foodItemRatings from "../models/foodItemRatings";
import { getItemRatings } from "./admin.controller";
import mongoose from "mongoose";

// export const feedbackHandler = (req: any, res: Response, next: NextFunction) => {
//   let data = req.user;
//   try {
//     let user: userResult = <userResult>(<unknown>User_Schema.findOne({ Email: data.email }));
//     if (!user) {
//       res.status(404).send("User Not Found");
//     } else {
//       let userId = user._id;
//       let userFeedbacks = feedback.find({ UserID: userId });
//       res.send(userFeedbacks).status(200);
//     }
//   } catch (error) {
//     res.status(501).send("Some Error Occured");
//     console.log(error);
//   }
// };

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

// export const userNotifications = (req: any, res: Response, next: NextFunction) => {
//   let data = req.user;
//   try {
//     let user: userResult = <userResult>(<unknown>User_Schema.findOne({ Email: data.email }));
//     if (!user) {
//       res.status(404).send("User Not Found");
//     } else {
//       let userMess = user.Eating_Mess;
//       let allNotifs = notifications.find({ Mess: userMess });
//       res.send(allNotifs).status(200);
//     }
//   } catch (error) {
//     res.status(501).send("Some Error Occured");
//     console.log(error);
//   }
// };
//

