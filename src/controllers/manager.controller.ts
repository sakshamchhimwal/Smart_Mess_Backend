import express, { response } from "express";
// import menu_table from "../models/menuTable";
// import meal_item from "../models/mealItem";
import { NextFunction, Response } from "express";
import { sendNotification } from "../config/firebaseWeb";
import notificationToken from "../models/notificationToken";
import notifications from "../models/notifications";
import feedbackForm from "../models/feedbackForm";
import user from "../models/user";
import mealItem from "../models/mealItem";
import menuTable from "../models/menuTable";
import mongoose, { ObjectId } from "mongoose";
import foodItemRatings from "../models/foodItemRatings";
import actualFeedback from "../models/actualFeedback";
import upload from "../config/multer";
// import { MealItems, MealRequest, MenuTableResult, userResult } from "../Interface/interfaces";
import mess from "../models/mess";
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
	let data = req.user;
	try {
		let currUser = await user.findOne({ Email: data.email });
		if (!currUser) {
			return res.send("User Not Found").status(404);
		} else {
			let userMess = currUser.Eating_Mess;
			let day = req.body.day;
			let mealType = req.body.mealType;
			let newMealItem = req.body.mealItem;
			console.log(new mongoose.Types.ObjectId(newMealItem));
			await menuTable.findOneAndUpdate({ Mess: userMess, Day: day, MealType: mealType }, { $addToSet: { Meal_Items: [new mongoose.Types.ObjectId(newMealItem)] } });
			return res.send("Inserted").status(200);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send("Some Error Occured");
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
		let items = getMenuItems(allTimeTable[i].Meal_Items);
		res.concat({ "Day": allTimeTable[i].Day, "MealType": allTimeTable[i].MealType, "Items": items.toString() });
	}
	return res;
}


export const managerTimeTable = async (req: any, res: Response, next: NextFunction) => {
	let data = req.user;
	// console.log(data.email);
	try {
		const currUser = await user.findOne({ Email: data.email });
		if (!currUser) {
			res.status(404).send("Manager not found");
		} else {
			const eatingMess = currUser?.Eating_Mess?._id;
			// console.log(eatingMess?._id);
			const allItems = await menuTable.find({ Mess: eatingMess });
			// console.log(allItems);
			return res.send(makeMenuDay(allItems)).status(200);
		}
	} catch (err) {
		console.log(err);
		res.send("Unexpected Error").status(500);
	}
};

export const deleteTimeTableHandler = async (req: any, res: Response, next: NextFunction) => {
	let data = req.user;
	try {
		let currUser = await user.findOne({ Email: data.email });
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

// const feedbackForm = new Schema({
//     Title: {
//         type: String,
//         required: true,
//     },
//     Description: String,
//     FormStartDate: {
//         type: Date,
//         required: true,
//     },
//     FormEndDate: {
//         type: Date,
//         required: true,
//     },
// });


export const floatFeedbackForm = async (req: any, res: Response) => {
	const { title, description } = req.body;
	if (!title) return res.status(400).send("Invalid Request");
	try {
		//add to notification collection
		const startDate = new Date();
		const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
		await feedbackForm.create({
			Title: title,
			Description: description,
			FormStartDate: startDate,
			FormEndDate: endDate
		});
		const tokens = await notificationToken.find();
		const tokenList = tokens.map((token) => token.Token);
		//run a loop to send notification to all tokens
		for (let i = 0; i < tokenList.length; i++) {
			await sendNotification(tokenList[i], title, description);
		}
		return res.status(200).send("Notification Sent");
	} catch (err) {
		console.log(err);
		return res.status(500).send("Some Error Occured");
	}
}


// const feedbackForm = new Schema({
//     Title: {
//         type: String,
//         required: true,
//     },
//     Description: String,
//     FormStartDate: {
//         type: Date,
//         required: true,
//     },
//     FormEndDate: {
//         type: Date,
//         required: true,
//     },
// });

export const getAllFeedbackForms = async (req: any, res: Response) => {
	try {
		const allForms = await feedbackForm.find();
		//sorting in descending order of start date
		allForms.sort((a, b) => {
			return b.FormStartDate.getTime() - a.FormStartDate.getTime();
		});
		return res.status(200).send(allForms);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Some Error Occured");
	}
}

export const getFeedbackFormSubmissions = async (req: any, res: Response) => {
	try {
		const formId = req.params.formID;
		const allSubmissions = await actualFeedback.find({ FormID: formId });
		//yet to decide the details to be viewed by manager is should contain the user details or not
		return res.status(200).send(allSubmissions);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Some Error Occured");
	}
}

export const getAllFoodItems = async (req: any, res: Response) => {
	const foodItems = await mealItem.find();
	let allItemNames = [];
	for (let i = 0; i < foodItems.length; i++) {
		allItemNames.push({ "Name": foodItems[i].Name, "Id": foodItems[i]._id });
	}
	res.send(allItemNames);
}


const __initItemRating = async (mess: any, foodItem: string) => {
	await foodItemRatings.create({
		Mess: new mongoose.Types.ObjectId(mess),
		FoodItem: new mongoose.Types.ObjectId(foodItem)
	});
}


const detailOneItem = async (mealItemId: any) => {
	let menuItems = {};
	let mealDetails = await mealItem.findById(mealItemId);
	if (mealDetails) {
		menuItems = { "Name": mealDetails.Name, "Image": mealDetails.Image };
	}
	return menuItems;
}


export const getItemRating = async (req: any, res: Response) => {
	let data = req.user;
	try {
		let currUser = await user.findOne({ Email: data.email });
		if (!currUser) {
			return res.status(404).send("User Not found");
		}
		console.log(req.body);
		let itemId = new mongoose.Types.ObjectId(req.body.itemId);
		let mess = currUser.Eating_Mess;
		let findRating = await foodItemRatings.findOne({ Mess: mess, FoodItem: itemId });
		if (!findRating) {
			return res.send("Item Not Rated Yet").status(200);
		}
		findRating = await foodItemRatings.findOne({ Mess: mess, FoodItem: itemId });
		const opc = await detailOneItem(itemId);
		console.log(opc);
		const rating = { "ItemDetails": opc, "Rating": findRating?.Rating, "NumberOfRev": findRating?.NumberOfReviews };
		res.send(rating).status(200);
	} catch (err) {
		console.log(err);
		res.status(501).send("Internal Error");
	}
}



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



