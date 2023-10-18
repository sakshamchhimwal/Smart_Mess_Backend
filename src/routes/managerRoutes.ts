import express from "express";

const router = express.Router();
// import { Authenticate } from "../middlewares/Authenticate";
// import { Authorize } from "../middlewares/Authorize";
import {
	createNewFoodItem, addTimeTable, makeAnnouncements, floatFeedbackForm, getAllFeedbackForms, getFeedbackFormSubmissions,
	deleteTimeTableHandler, managerTimeTable, getAllFoodItems, getItemRating, getTimeSeries, addTimeSeries,

} from "../controllers/manager.controller";


router.post("/dashboard/makeAnnouncement", makeAnnouncements);
router.post("/dashboard/floatFeedbackForm", floatFeedbackForm);
router.get("/dashboard/allFeedbackForms", getAllFeedbackForms);
router.get("/dashboard/feedbackFormSubmissions/:formID", getFeedbackFormSubmissions);
router.put("/dashboard/createFoodItem", createNewFoodItem);
router.patch("/dashboard/addTimeTable", addTimeTable);
router.delete("/dashboard/deleteTimeTable", deleteTimeTableHandler);
router.get("/dashboard/timetable", managerTimeTable);
router.get("/dashboard/allFoodItems", getAllFoodItems);
router.post("/dashboard/getItemRating", getItemRating);
router.get("/dashboard/getTimeSeries", getTimeSeries);
router.post("/dashboard/addTimeSeries", addTimeSeries);
// router.get("/dashboard/allRatings", Authenticate, Authorize, viewRatings);
// router.get("dashboard/ongoingMeal", Authenticate, Authorize, ongoingMeal);

export default router;
