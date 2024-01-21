import express from "express";
import {
  giveRating,
  userTimeTable,
  submitFeedback,
  webAddNotificationTokenHandler,
  makeRead,
  getAllNotifications,
  makeAllRead,
  submitFoodReview,
  getUserFoodReview,
  androidAddNotificationTokenHandler,
} from "../controllers/user.controller";
const userRouter = express.Router();


// GET Routes
userRouter.get("/dashboard/timetable", userTimeTable);
userRouter.get("/dashboard/notifications", getAllNotifications);
userRouter.get("/dashboard/getFoodReview", getUserFoodReview);

// POST Routes
userRouter.post("/dashboard/giveRating", giveRating);
userRouter.post("/dashboard/submitFeedback", submitFeedback);
userRouter.post("/addNotificationToken/web", webAddNotificationTokenHandler);
userRouter.post("/addNotificationToken/android", androidAddNotificationTokenHandler);
userRouter.post("/dashboard/makeRead", makeRead);
userRouter.post("/dashboard/makeAllRead", makeAllRead);
userRouter.post("/dashboard/submitFoodReview", submitFoodReview);

// REST Routes
userRouter.get("/dashboard/suggestions",);
userRouter.post("/dashboard/suggestion",);
userRouter.patch("/dashboard/suggestion",);
userRouter.delete("/dashboard/suggestion",);


export default userRouter;

