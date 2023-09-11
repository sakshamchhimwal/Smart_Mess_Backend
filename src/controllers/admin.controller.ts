// import menuTable from "../models/menuTable";

// require("dotenv").config();
// import express, { Request, Response, NextFunction } from "express";
// import { userResult } from "../Interface/interfaces";
// import user from "../models/user";
// import complaint from "../models/complaint";

// export const getComplaints = async (req: any, res: Response, next: NextFunction) => {
//     let data = req.user;
//     try {
//         let currUser: userResult = <userResult>(<unknown>user.findOne({ Email: data.email }));
//         if (!currUser) {
//             res.status(404).send("User not found");
//         } else {
//             let userMess = currUser.Eating_Mess;
//             let allComplaints = complaint.find({ Mess: userMess });
//             res.send(allComplaints).status(200);
//         }
//     } catch (error) {
//         res.status(501).send("Some Error orccured");
//         console.log(error);
//     }
// };

// export const foodRating = async (req: any, res: Response, next: NextFunction) => {
//     let data = req.user;
//     try{
//         let currUser: userResult = <userResult>(<unknown>user.findOne({Email: data.email}));
//         if(!currUser){
//             res.status(404).send("User not found");
//         }else{
//             let userMess = currUser.Eating_Mess;
//             let allMenus =await menuTable.find({Mess:userMess});
//             let allItems: any = [];
//             for (const items in allMenus) {
//                 for(const item in (<any>items).Meal_Items){
//                     allItems.concat(item);
//                 }
//             }
//             res.send(allItems).status(200);
//         }
//     }catch (err){
//         console.log(err);
//         res.status(501).send("Unexpected Error");
//     }
// }