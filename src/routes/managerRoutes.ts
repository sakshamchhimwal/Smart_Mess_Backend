import express from "express";

const router = express.Router();
import {
	createNewFoodItem, addTimeTable, makeAnnouncements, floatFeedbackForm, getAllFeedbackForms, getFeedbackFormSubmissions,
	deleteTimeTableHandler, managerTimeTable, getAllFoodItems, getItemRating, getTimeSeries, addTimeSeries,

} from "../controllers/manager.controller";

// GET Routes
router.get("/dashboard/allFeedbackForms", getAllFeedbackForms);
router.get("/dashboard/feedbackFormSubmissions/:formID", getFeedbackFormSubmissions);
router.get("/dashboard/timetable", managerTimeTable);
router.get("/dashboard/allFoodItems", getAllFoodItems);
router.get("/dashboard/getTimeSeries", getTimeSeries);

// POST Routes
router.post("/dashboard/makeAnnouncement", makeAnnouncements);
router.post("/dashboard/floatFeedbackForm", floatFeedbackForm);
router.post("/dashboard/getItemRating", getItemRating);
router.post("/dashboard/addTimeSeries", addTimeSeries);

// PUT Routes
router.put("/dashboard/createFoodItem", createNewFoodItem);

// Patch Routes
router.patch("/dashboard/addTimeTable", addTimeTable);

// DELETE Routes
router.delete("/dashboard/deleteTimeTable", deleteTimeTableHandler);

export default router;
