import express from "express";
import multer from "multer";

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
import {
  deleteSuggestion,
  deleteSuggestionComment,
  getSuggestions,
  patchSuggestion,
  patchSuggestionComment,
  postSuggestion,
  postSuggestionComment,
  voteSuggestionComment,
  markAsClosed,
} from "../controllers/UserControllers/user.suggestions.controller";
import {
  getAllSuggestions,
  voteSuggestion,
} from "../controllers/UserControllers/user.dashboard.controller";
import { uploadToCloudinary } from "../services/uploadToCloudinary";
import user from "../models/user";
// import uploadToCloudinary from "../services/uploadToCloudinary";
const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp/uploads/users");
  },
  filename: function (req, file, cb) {
    const splitted = file.originalname.split(".");
    const ext = splitted[splitted.length - 1];
    const uniqueSuffix = req.body.suggestionId;
    cb(null, uniqueSuffix + `.${ext}`);
  },
});

const upload = multer({ storage: storage });

// GET Routes
userRouter.get("/dashboard/timetable", userTimeTable);
userRouter.get("/dashboard/notifications", getAllNotifications);
userRouter.get("/dashboard/getFoodReview", getUserFoodReview);
userRouter.get("/dashboard/allSuggestions", getAllSuggestions);

// POST Routes
userRouter.post("/dashboard/giveRating", giveRating);
userRouter.post("/dashboard/submitFeedback", submitFeedback);
userRouter.post("/addNotificationToken/web", webAddNotificationTokenHandler);
userRouter.post(
  "/addNotificationToken/android",
  androidAddNotificationTokenHandler
);
userRouter.post("/dashboard/makeRead", makeRead);
userRouter.post("/dashboard/makeAllRead", makeAllRead);
userRouter.post("/dashboard/submitFoodReview", submitFoodReview);

// PATCH Routes
userRouter.patch("/dashboard/suggestion", voteSuggestion);
userRouter.patch("/dashboard/suggestion/comment", voteSuggestionComment);

// REST Routes
userRouter.get("/profile/suggestion", getSuggestions);
userRouter.post(
  "/profile/suggestion",
  upload.single("image"),
  uploadToCloudinary,
  postSuggestion
);
userRouter.patch("/profile/suggestion", patchSuggestion);
userRouter.delete("/profile/suggestion", deleteSuggestion);

userRouter.post("/profile/suggestion/comment", postSuggestionComment);
userRouter.patch("/profile/suggestion/comment", patchSuggestionComment);
userRouter.delete("/profile/suggestion/comment", deleteSuggestionComment);

userRouter.patch("/profile/suggestion/markAsClosed", markAsClosed);

export default userRouter;
