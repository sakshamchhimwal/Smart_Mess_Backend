import user from "../models/user";

require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import User_Schema from "../models/user";
import { GoogleUserResult, JWTLoadData, userResult } from "../Interface/interfaces";
import feedback from "../models/feedback";
import menuTable from "../models/menuTable";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import notifications from "../models/notifications";
import mealItem from "../models/mealItem";

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


export const userDetails = (req: any, res: Response, next: NextFunction) => {
	let data = req.user;
	try {
		let currUser: userResult = <userResult>(<unknown>user.findOne({ Email: data.email }));
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


// export const createUser = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		let currUser = await user.findOne({ Email: req.body.Email });
// 		if (currUser) {
// 			res.status(400);
// 			res.send({ error: "User Already Exists" });
// 		} else {
// 			const salt = await bcrypt.genSalt(10);
// 			const secPass = await bcrypt.hash(req.body.pass, salt);
// 			let newUser = await User_Schema.create({
// 				Username: req.body.Username,
// 				Password: secPass,
// 				Email: req.body.Email,
// 				Phone_Number: req.body.Phone_Number,
// 				Role: req.body.Role,
// 				First_Name: req.body.First_Name,
// 				Last_Name: req.body.Last_Name,
// 				Last_Login: Date.now(),
// 			});
// 			const data: JWTLoadData = {
// 				user: {
// 					email: newUser.Email,
// 					role: newUser.Role!,
// 					time: Date.now(),
// 				},
// 			};
// 			const authToken = jwt.sign(data, process.env.JWT_KEY!);
// 			res.send({ authToken });
// 		}
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).send("Some Error Occured");
// 	}
// };
