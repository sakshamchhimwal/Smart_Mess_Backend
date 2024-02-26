import express, { response } from "express";
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
import mess from "../models/mess";
import ratingTimeSeries from "../models/ratingTimeSeries";
import NodeCache from "node-cache";
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const createNewFoodItem = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let data = req.user;
  try {
    let currUser = await user.findOne({ Email: data.email });
    if (!currUser) {
      return res.send("User Not found").status(404);
    }
    let name = req.body.name;
    let image = req.body.image;
    let category = req.body.category;
    await mealItem.create({
      Name: name,
      Image: image,
      Category: category,
    });
    res.send("Inserted").status(200);
  } catch (e) {
    res.send("Internal Server Error").status(501);
  }
};

export const addTimeTable = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
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
      console.log(req.body);
      console.log(new mongoose.Types.ObjectId(newMealItem));
      await menuTable.findOneAndUpdate(
        { Mess: userMess, Day: day, MealType: mealType },
        {
          $addToSet: {
            Meal_Items: [new mongoose.Types.ObjectId(newMealItem)],
          },
        }
      );
      const val1 = myCache.del("manTT");
      const val2 = myCache.del("userTT");
      return res.send("Inserted").status(200);
    }
  } catch (error) {
    console.log(error);
    return res.status(501).send("Internal Server Error");
  }
};

const getMenuItems = async (mealItems: any[]) => {
  let menuItems: any[] = [];
  for (let i = 0; i < mealItems.length; i++) {
    let mealDetails = await mealItem.findById(mealItems[i]);
    if (mealDetails) {
      menuItems.concat({
        Name: mealDetails.Name,
        Image: mealDetails.Image,
      });
    }
  }
  return menuItems;
};

const makeMenuDay = (allTimeTable: any[]) => {
  let res: any[] = [];
  for (let i = 0; i < allTimeTable.length; i++) {
    let items = getMenuItems(allTimeTable[i].Meal_Items);
    res.concat({
      Day: allTimeTable[i].Day,
      MealType: allTimeTable[i].MealType,
      Items: items.toString(),
    });
  }
  return res;
};

export const managerTimeTable = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let data = req.user;
  try {
    let currUser = await user.findOne({ Email: data.email });
    if (!currUser) {
      res.status(404).send("User not found");
    } else {
      let value = myCache.get("manTT");
      if (value === undefined) {
        let userMess: any = currUser.Eating_Mess;
        let ttSer = [];
        let allTimeTable = await menuTable.find({ Mess: userMess });
        ttSer = await Promise.all(
          allTimeTable.map(async (ele) => {
            return {
              id: ele.id,
              Day: ele.Day,
              Type: ele.MealType,
              Items: await Promise.all(
                ele.Meal_Items.map(async (foodId) => {
                  return await mealItem.findById(foodId);
                })
              ),
            };
          })
        );
        let success = myCache.set("manTT", ttSer, 3000);
        if (success) {
          console.log("cached the tt");
        }
        return res.send(ttSer);
      } else {
        return res.send(value).status(216);
      }
    }
  } catch (e) {
    res.send("Unexpected Error").status(501);
    console.log(e);
  }
};

export const deleteTimeTableHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
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
      const allFoodItems = await menuTable.findOne({
        Mess: userMess,
        Day: day,
        MealType: mealType,
      });
      console.log(allFoodItems?.Meal_Items);
      const filterItems = allFoodItems?.Meal_Items.filter((objItemId) => {
        return objItemId._id != delMealItem;
      });
      console.log(filterItems);
      await menuTable.findOneAndUpdate(
        { Mess: userMess, Day: day, MealType: mealType },
        { Meal_Items: filterItems }
      );
      return res.send("Deleted").status(200);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const makeAnnouncements = async (req: any, res: Response) => {
  const { title, description, link } = req.body;
  if (!title || !description) return res.status(400).send("Invalid Request");
  try {
    //add to notification collection
    const newNotification = await notifications.create({
      Title: title,
      Message: description,
      Date: new Date(),
      readBy: [],
      Attachment: link ? link : "",
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
    return res.status(500).send("Internal Server Error");
  }
};

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
      FormEndDate: endDate,
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
    return res.status(500).send("Internal Server Error");
  }
};

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
    return res.status(500).send("Internal Server Error");
  }
};

export const getFeedbackFormSubmissions = async (req: any, res: Response) => {
  try {
    const formId = req.params.formID;
    const allSubmissions = await actualFeedback.find({ FormID: formId });
    //yet to decide the details to be viewed by manager is should contain the user details or not
    return res.status(200).send(allSubmissions);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getAllFoodItems = async (req: any, res: Response) => {
  try {
    const foodItems = await mealItem.find().sort("Name");
    let allItemNames = [];
    for (let i = 0; i < foodItems.length; i++) {
      allItemNames.push({
        Name: foodItems[i].Name,
        Id: foodItems[i]._id,
        Img: foodItems[i].Image,
      });
    }
    return res.send(allItemNames).status(200);
  } catch (err) {
    console.log(err);
    return res.send({ Error: "Internal Server Error" }).status(501);
  }
};

const __initItemRating = async (mess: any, foodItem: string) => {
  await foodItemRatings.create({
    Mess: new mongoose.Types.ObjectId(mess),
    FoodItem: new mongoose.Types.ObjectId(foodItem),
  });
};

const detailOneItem = async (mealItemId: any) => {
  let menuItems = {};
  let mealDetails = await mealItem.findById(mealItemId);
  if (mealDetails) {
    menuItems = { Name: mealDetails.Name, Image: mealDetails.Image };
  }
  return menuItems;
};

export const getItemRating = async (req: any, res: Response) => {
  let data = req.user;
  try {
    let currUser = await user.findOne({ Email: data.email });
    if (!currUser) {
      return res.status(404).send("User Not found");
    }
    // console.log(req.body);
    let itemId = new mongoose.Types.ObjectId(req.body.itemId);
    let mess = currUser.Eating_Mess;
    let findRating = await foodItemRatings.find({ Mess: mess });
    if (!findRating) {
      return res.send("Item Not Rated Yet").status(200);
    }
    const opc = await detailOneItem(itemId);
    console.log(opc);
    return res.status(201).send(findRating);
  } catch (err) {
    console.log(err);
    res.status(501).send("Internal Error");
  }
};

export const getTimeSeries = async (req: any, res: Response) => {
  let data = req.user;
  try {
    let currUser = await user.findOne({ Email: data.email });
    if (!currUser) {
      return res.send("User Not Found").status(404);
    } else {
      let allTimeSeries = await ratingTimeSeries.find({});
      return res.send(allTimeSeries).status(200);
    }
  } catch (err) {
    console.log(err);
    res.status(501).send("Internal Server Error");
  }
};

export const addTimeSeries = async (req: any, res: Response) => {
  const data = req.user;
  try {
    let currUser = await user.findOne({ Email: data.email });
    if (!currUser) {
      return res.send("User Not Found").status(404);
    } else {
      const date = new Date(req.body.date);
      const foodItemId = req.body.foodItemId;
      const rating = req.body.rating;
      const numberOfRev = req.body.numberOfRev;
      const dateString = date.toDateString();
      const result = await ratingTimeSeries.create({
        Date: dateString,
        FoodItemId: foodItemId,
        Rating: rating,
        NoOfReviews: numberOfRev,
      });
      console.log(result);
      return res.send("Data Added Successfully").status(200);
    }
  } catch {
    res.send("Internal Server Error").status(501);
  }
};
