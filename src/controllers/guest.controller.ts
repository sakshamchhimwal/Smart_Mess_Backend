import { GuestBody, TimeTableReq, OngoingMealRequest } from "../Interface/interfaces";
import express, { Request, Response, NextFunction } from "express";
import guestFeedBack from "../models/guestFeedBack";
import mess from "../models/mess";
import menuTable from "../models/menuTable";
import foodItem from "../models/mealItem";

export const createGuestUserHandler = async (req: GuestBody, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name) {
      res.status(401).send("Provide Name");
    }
    if (!req.body.email) {
      res.status(401).send("Provide Email Address");
    }
    let guest = await guestFeedBack.findOne({ Email: req.body.email });
    if (guest) {
      res.status(400).send({ error: "User Already Exists" });
    } else {
      let eatMess = await mess.findOne({ messName: req.body.mess });
      if (!eatMess) {
        res.status(400).send({ error: "Mess Does Not Exist" });
      } else {
        guest = await guestFeedBack.create({
          Name: req.body.name,
          Email: req.body.email,
          Feedback: req.body.feedback,
          Image: req.body.image,
          Date: Date.now(),
          Mess: eatMess,
        });
      }
    }
    res.status(200).send("Feedback Noted");
  } catch (error) {
    console.log(error);
    res.status(500).send("Some Error Occured");
  }
};

export const guestTimeTableHandler = async (
  req: TimeTableReq,
  res: Response,
) => {
  try {
    console.log(req.body.mess);
    let currMess = await mess.findOne({ messName: req.body.mess });
    if (!currMess) {
      res.status(404).send("Mess Not Found");
    } else {
      let meals = await menuTable.find({ Mess: currMess._id });
      let allFoodItems = await foodItem.find();
      let result: Map<string, any> = new Map();
      meals.forEach((meal) => {
        let day = meal.Day;
        let mealType = meal.MealType;
        let mealItems: any = [];
        meal.Meal_Items.forEach((item) => {
          let currItem = allFoodItems.find((food) => food._id.toString() === item.toString());
          mealItems.push(currItem);
        });
        if (result.has(day)) {
          let currDay = result.get(day);
          currDay[mealType] = mealItems;
          result.set(day, currDay);
        } else {
          let currDay: any = {};
          currDay[mealType] = mealItems;
          result.set(day, currDay);
        }
      });
      //jsonify result
      let finalResult: any = {};
      result.forEach((value, key) => {
        finalResult[key] = value;
      }
      );
      res.status(200).send(finalResult);
    }
  } catch (err) {
    console.log(err);
    res.send("Unexpected Error").status(500);
  }
};

export const guestCurrentMeal = async (
  req: OngoingMealRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let currMess = await mess.findOne({ messName: req.body.mess });
    if (!currMess) {
      res.status(404).send("Mess Not Found");
    }
    let day: number = req.body.date.getDay();
    let time: number = req.body.date.getHours();
    if (time > 22 && time < 10) {
      res
        .status(400)
        .send(menuTable.findOne({ Mess: currMess } && { MealType: 1 } && { Day: day }));
    }
    if (time > 10 && time < 15) {
      res
        .status(400)
        .send(menuTable.findOne({ Mess: currMess } && { MealType: 2 } && { Day: day }));
    }
    if (time > 15 && time < 18) {
      res
        .status(400)
        .send(menuTable.findOne({ Mess: currMess } && { MealType: 3 } && { Day: day }));
    }
    if (time > 18 && time < 22) {
      res
        .status(400)
        .send(menuTable.findOne({ Mess: currMess } && { MealType: 4 } && { Day: day }));
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Unexpected Error");
  }
};


// testing repo health