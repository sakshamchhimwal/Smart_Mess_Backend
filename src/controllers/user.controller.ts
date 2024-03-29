import user from "../models/user";
import actualFeedback from "../models/actualFeedback";
import feedbackForm from "../models/feedbackForm";
import notificationToken from "../models/notificationToken";
import notifications from "../models/notifications";
import express, { Request, Response, NextFunction } from "express";
import {
  GoogleUserResult,
  JWTLoadData,
  userResult,
} from "../Interface/interfaces";
import menuTable from "../models/menuTable";
import mealItem from "../models/mealItem";
import foodItemRatings from "../models/foodItemRatings";
import { getItemRatings } from "./admin.controller";
import mongoose from "mongoose";
import NodeCache from "node-cache";
import dateWiseUserFeedback from "../models/dateWiseUserFeedback";
import usernotifications from "../models/usernotifications";
import dayjs from "dayjs";

const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const getItemByID = async (itemId: any) => {
  let eleDetails = await mealItem.findById(itemId);
  return {
    Name: eleDetails?.Name,
    Image: eleDetails?.Image,
  };
};

export const userTimeTable = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let data = req.user;
  try {
    let currUser: userResult = await (<userResult>(
      (<unknown>user.findOne({ Email: data.email }))
    ));
    if (!currUser) {
      res.status(404).send("User not found");
    } else {
      let value = myCache.get("userTT");
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
        let success = myCache.set("userTT", ttSer, 3000);
        if (success) {
          console.log("cached the tt");
        }
        return res.send(ttSer);
      } else {
        return res.send(value).status(216);
      }
    }
  } catch (e) {
    res.send("Unexpected Error").status(500);
    console.log(e);
  }
};

export const userDetails = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let data = req.user;
  try {
    let currUser: userResult = await (<userResult>(
      (<unknown>user.findOne({ Email: data.email }))
    ));
    if (!currUser) {
      res.status(404).send("User Not Found");
    } else {
      res.send(currUser).status(200);
    }
  } catch (error) {
    res.status(500).send("Some Error Occured");
    console.log(error);
  }
};

const __initItemRating = async (mess: any, foodItem: string) => {
  console.log(mess);
  await foodItemRatings.create({
    Mess: new mongoose.Types.ObjectId(mess),
    FoodItem: new mongoose.Types.ObjectId(foodItem),
  });
};

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
      let currItemRating = await foodItemRatings.findOne({
        FoodItem: foodId,
        Mess: eatingMess,
      });
      if (!currItemRating) {
        await __initItemRating(eatingMess?.toString(), foodId);
      }
      currItemRating = await foodItemRatings.findOne({
        FoodItem: foodId,
        Mess: eatingMess,
      });
      console.log(currItemRating);
      let currRating = currItemRating?.Rating;
      let currNumReviewes = currItemRating?.NumberOfReviews;
      let newRating =
        (currRating! * currNumReviewes! + rating) / (currNumReviewes! + 1);
      await foodItemRatings.findOneAndUpdate(
        { FoodItem: foodId, Mess: eatingMess },
        { Rating: newRating, NumberOfReviews: currNumReviewes! + 1 }
      );
      return res.status(200).send({ message: "Updated" });
    }
  } catch (err) {
    console.log("Error giveRating", err);
    return res.status(500).send("Interal Server Error");
  }
};

export const getLatestUpdates = async (req: any, res: Response) => {
  try {
    const currUser = await user.findOne({ Email: req.user.email });
    //yet to be implemented
  } catch (err) {
    console.log(err);
    res.status(500).send("Some Error Occured");
  }
};

export const webAddNotificationTokenHandler = async (
  req: any,
  res: Response
) => {
  const { notification_token } = req.body;
  const Email = req.user.email;
  if (!notification_token) return res.status(400).send("Invalid Request");
  try {
    //check if token already exists with email and platform - web if yes then update it else create new
    const token = await notificationToken.findOneAndUpdate(
      { Email: Email, Platform: "web" },
      { Token: notification_token },
      { new: true, upsert: true }
    );
    return res.status(200).send(token);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Some Error Occured");
  }
};

export const androidAddNotificationTokenHandler = async (
  req: any,
  res: Response
) => {
  const { notification_token } = req.body;
  const Email = req.user.email;
  if (!notification_token) return res.status(400).send("Invalid Request");
  try {
    //check if token already exists with email and platform - web if yes then update it else create new
    const token = await notificationToken.findOneAndUpdate(
      { Email: Email, Platform: "android" },
      { Token: notification_token },
      { new: true, upsert: true }
    );
    return res.status(200).send(token);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Some Error Occured");
  }
};

export const getAllNotifications = async (req: any, res: Response) => {
  try {
    const currUser: any = await user.findOne({ Email: req.user.email });
    const userNotifications = await usernotifications.find({
      sendTo: currUser._id,
    });

    const allNotifications = await notifications.find();
    const announcementResponse: any = allNotifications.map((notification) => ({
      _id: notification._id,
      Title: notification.Title,
      Message: notification.Message,
      Date: notification.Date,
      Attachment: notification.Attachment,
      read: notification.readBy.includes(currUser._id),
      messageType: "announcement",
      sortParam: notification.Date,
    }));

    userNotifications.map((notification) => {
      announcementResponse.push({
        _id: notification._id,
        Title: notification.Title,
        Message: notification.Message,
        Date: notification.Date,
        Attachment: notification.Attachment,
        read: notification.readBy.includes(currUser._id),
        messageType: "Mark as resolved",
        sortParam: notification.Date,
      });
    });

    const allFeedbacks = await feedbackForm.find();
    //first check whether the user has submitted the feedback or not
    //if yes then don't show the feedback form
    //also check whether the feedback form is active or not
    //the feedback form is active if the current date is between the start and end date
    let feedbackResponse: any = await Promise.all(
      allFeedbacks.map(async (feedback) => {
        if (Date.now() > feedback.FormEndDate.getTime()) return null;
        if (
          await actualFeedback.findOne({
            Email: currUser.Email,
            FormID: feedback._id,
          })
        )
          return null;
        return {
          _id: feedback._id,
          Title: feedback.Title,
          Description: feedback.Description,
          FormStartDate: feedback.FormStartDate,
          FormEndDate: feedback.FormEndDate,
          messageType: "feedback",
          sortParam: feedback.FormStartDate,
        };
      })
    );
    let response = null;
    if (feedbackResponse) response = feedbackResponse;
    if (announcementResponse) response = response.concat(announcementResponse);
    if (response) {
      response.sort((a: any, b: any) => {
        return b ? b.sortParam - a.sortParam : 0;
      });
    }
    return res.status(200).send(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const makeRead = async (req: any, res: Response) => {
  console.log(req.body);
  try {
    const currUser: any = await user.findOne({ Email: req.user.email });
    const notifId = req.body.notifId;
    const type = req.body.type;
    let notif;

    if (type === "Mark as resolved") {
      notif = await usernotifications.findOne({ _id: notifId });
    } else {
      notif = await notifications.findOne({ _id: notifId });
    }

    if (notif) {
      if (type === "Mark as resolved") {
        await usernotifications.findByIdAndUpdate(notif._id, {
          $addToSet: { readBy: [new mongoose.Types.ObjectId(currUser._id)] },
        });
      } else {
        await notifications.findByIdAndUpdate(notif._id, {
          $addToSet: { readBy: [new mongoose.Types.ObjectId(currUser._id)] },
        });
      }

      return res.send("Read").status(200);
    } else {
      return res.send("Unexpected Error").status(404);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const makeAllRead = async (req: any, res: Response) => {
  try {
    const currUser: any = await user.findOne({ Email: req.user.email });
    const notif = await notifications.find({});

    const updatePromises = notif.map(async (element) => {
      if (element) {
        await notifications.findByIdAndUpdate(element._id, {
          $addToSet: {
            readBy: new mongoose.Types.ObjectId(currUser._id),
          },
        });
      }
    });

    await Promise.all(updatePromises);

    return res.status(200).send("Read");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const submitFeedback = async (req: any, res: Response) => {
  try {
    const currUser = await user.findOne({ Email: req.user.email });
    const {
      // FormID,
      BreakfastRating,
      LunchRating,
      DinnerRating,
      SnacksRating,
      Comments,
      MessServiceRating,
      HygieneRating,
    } = req.body;

    if (!currUser) {
      return res.status(404).send("No User Exists");
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const exists = await actualFeedback.findOne({
      Email: req.user.email,
      Date: formattedDate,
    });

    if (exists) {
      return res.status(409).send("Feedback Already Exists");
    } else {
      await actualFeedback.create({
        Email: currUser?.Email,
        Date: formattedDate,
        BreakfastRating,
        LunchRating,
        DinnerRating,
        SnacksRating,
        Comments,
        MessServiceRating,
        HygieneRating,
      });

      return res.status(200).send("Feedback Submitted");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

const makeDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const getUserFoodReview = async (req: any, res: Response) => {
  try {
    const currUser = await user.findOne({ Email: req.user.email });
    if (!currUser) {
      return res.send("No User Exists").status(404);
    }
    const isPresent = await dateWiseUserFeedback.findOne({
      userId: currUser._id,
      date: dayjs().format('YYYY-MM-DD'),
    }).populate({
      path: 'ratings',
      populate: {
        path: 'foodId'
      }
    });
    if (isPresent) {
      return res.status(200).send(isPresent.ratings);
    } else {
      return res.status(200).send([]);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Intrnal Server error");
  }
};

export const submitFoodReview = async (req: any, res: Response) => {
  try {
    const currUser = await user.findOne({ Email: req.user.email });
    if (!currUser) {
      return res.send("No User Exists").status(403);
    }

    const { id, value, comments } = req.body;
    const date = dayjs().format('YYYY-MM-DD');

    const query = { userId: currUser._id, date: date };
    const newValue = { foodId: id, rating: value, review: comments };
    console.log(newValue);
    // Update or create with upsert: true
    const updateResult = await dateWiseUserFeedback.findOneAndUpdate(query, {
      $push: { ratings: newValue }
    }, { upsert: true });

    // Handle successful update/creation
    return res.send({ message: "FeedBack Added" }).status(200);

  } catch (err) {
    console.error("Error adding/updating food review:", err);
    return res.status(500).send("Internal Server Error");
  }
};
