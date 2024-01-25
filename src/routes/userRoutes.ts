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
import {
	deleteSuggestion,
	getSuggestions,
	patchSuggestion,
	postSuggestion,
} from "../controllers/UserControllers/user.suggestions.controller";
import {
	getAllSuggestions,
	voteSuggestion,
} from "../controllers/UserControllers/user.dashboard.controller";
const userRouter = express.Router();

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

// REST Routes
userRouter.get("/profile/suggestion", getSuggestions);
userRouter.post("/profile/suggestion", postSuggestion);
userRouter.patch("/profile/suggestion", patchSuggestion);
userRouter.delete("/profile/suggestion", deleteSuggestion);

export default userRouter;
