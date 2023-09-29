import express from "express";
// import menu_table from "../models/menuTable";
// import meal_item from "../models/mealItem";
import { NextFunction, Response } from "express";
import { sendNotification } from "../config/firebaseWeb";
import notificationToken from "../models/notificationToken";
import notifications from "../models/notifications";
import user from "../models/user";
import mealItem from "../models/mealItem";
import menuTable from "../models/menuTable";
import mongoose, { ObjectId } from "mongoose";
// import { MealItems, MealRequest, MenuTableResult, userResult } from "../Interface/interfaces";
// import mess from "../models/mess";
// import user from "../models/user";
// import feedback from "../models/feedback";
// import menuTable from "../models/menuTable";
// import notifications from "../models/notifications";

export const createNewFoodItem = async (req: any, res: Response, next: NextFunction) => {
	try {
		let name = req.body.name;
		let image = req.body.image;
		let category = req.body.category;
		await mealItem.create({
			Name: name,
			Image: image,
			Category: category
		});
		res.send("Inserted").status(200);
	} catch (e) {
		res.send("Unexpected Error").status(501);
	}
}

export const addTimeTable = async (req: any, res: Response, next: NextFunction) => {
	// let data = req.user;
	// console.log(data);

	try {
		let currUser = await user.findOne({ Email: req.body.Email });
		if (!currUser) {
			return res.send("User Not Found").status(404);
		} else {
			let userMess = currUser.Eating_Mess;
			let day = req.body.day;
			let mealType = req.body.mealType;
			let newMealItem = req.body.mealItem;
			await menuTable.findOneAndUpdate({ Mess: userMess, Day: day, MealType: mealType }, { $addToSet: { Meal_Items: [new mongoose.Types.ObjectId(newMealItem)] } });
			return res.send("Inserted").status(200);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send("Some Error Occured");
	}
};

// export const managerTimeTable = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     let currMess = await mess.findOne({ messName: req.body.mess });
//     if (!currMess) {
//       res.status(404).send("Mess Not Found");
//     } else {
//       let meals: any = await menu_table.find({ Mess: currMess });
//       res.send(meals).status(200);
//     }
//   } catch (err) {
//     console.log(err);
//     res.send("Unexpected Error").status(500);
//   }
// };

export const deleteTimeTableHandler = async (req: any, res: Response, next: NextFunction) => {
	// let data = req.user;
	try {
		let currUser = await user.findOne({ Email: req.body.email });
		if (!currUser) {
			return res.send("User Not Found").status(404);
		} else {
			let userMess = currUser.Eating_Mess;
			let day = req.body.day;
			let mealType = req.body.mealType;
			let delMealItem = req.body.mealItem;
			const allFoodItems = await menuTable.findOne({ Mess: userMess, Day: day, MealType: mealType });
			console.log(allFoodItems?.Meal_Items)
			const filterItems = allFoodItems?.Meal_Items.filter((objItemId) => { return objItemId._id != delMealItem });
			console.log(filterItems);
			await menuTable.findOneAndUpdate({ Mess: userMess, Day: day, MealType: mealType }, { Meal_Items: filterItems });
			return res.send("Deleted").status(200);
		}
	} catch (err) {
		console.log(err);
		return res.status(500).send("Some Error Occured");
	}
};

export const makeAnnouncements = async (req: any, res: Response) => {
	const { title, body } = req.body;
	if (!title || !body) return res.status(400).send("Invalid Request");
	try {
		//add to notification collection
		const newNotification = await notifications.create({
			Title: title,
			Message: body,
			Date: new Date(),
			readBy: []
		});
		const tokens = await notificationToken.find();
		const tokenList = tokens.map((token) => token.Token);
		//run a loop to send notification to all tokens
		for (let i = 0; i < tokenList.length; i++) {
			await sendNotification(tokenList[i], title, body);
		}
		return res.status(200).send("Notification Sent");
	}
	catch (err) {
		console.log(err);
		return res.status(500).send("Some Error Occured");
	}
};


// export const viewRatings = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     let manager = await (<userResult>(<unknown>user.findOne({ Email: req.user.email })));
//     if (!manager) {
//       res.status(404).send("Manager Not Found");
//     } else {
//       let eatingMess = (<userResult>(<unknown>user.findOne({ Email: req.user.email }))).Eating_Mess;
//       let allFeedbacks = feedback.find({ Mess: eatingMess });
//       res.send(allFeedbacks).status(200);
//     }
//   } catch (error) {
//     res.send("Unexpected Error").status(501);
//     console.log(error);
//   }
// };

// export const ongoingMeal = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     let manager = await (<userResult>(<unknown>user.findOne({ Email: req.user.email })));
//     if (!manager) {
//       res.status(404).send("Manager Not Found");
//     } else {
//       let currMess = await (<userResult>(<unknown>user.findOne({ Email: req.user.email })))
//         .Eating_Mess;
//       if (!currMess) {
//         res.status(404).send("Mess Not Found");
//       }
//       let day: number = req.body.date.getDay();
//       let time: number = req.body.date.getHours();
//       if (time > 22 && time < 10) {
//         res
//           .status(400)
//           .send(menu_table.findOne({ Mess: currMess } && { MealType: 1 } && { Day: day }));
//       }
//       if (time > 10 && time < 15) {
//         res
//           .status(400)
//           .send(menu_table.findOne({ Mess: currMess } && { MealType: 2 } && { Day: day }));
//       }
//       if (time > 15 && time < 18) {
//         res
//           .status(400)
//           .send(menu_table.findOne({ Mess: currMess } && { MealType: 3 } && { Day: day }));
//       }
//       if (time > 18 && time < 22) {
//         res
//           .status(400)
//           .send(menu_table.findOne({ Mess: currMess } && { MealType: 4 } && { Day: day }));
//       }
//     }
//   } catch (error) {
//     res.send("Unexpected Error").status(501);
//     console.log(error);
//   }
// };
