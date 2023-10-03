import express from "express";

const router = express.Router();
// import { Authenticate } from "../middlewares/Authenticate";
// import { Authorize } from "../middlewares/Authorize";
import {
	createNewFoodItem, addTimeTable,
	makeAnnouncements, floatFeedbackForm, deleteTimeTableHandler, managerTimeTable, getAllFoodItems, getItemRating,
	
} from "../controllers/manager.controller";


router.post("/dashboard/makeAnnouncement", makeAnnouncements);
router.post("/dashboard/floatFeedbackForm", floatFeedbackForm);
router.put("/dashboard/createFoodItem", createNewFoodItem);
router.patch("/dashboard/addTimeTable", addTimeTable);
router.delete("/dashboard/deleteTimeTable", deleteTimeTableHandler);
router.get("/dashboard/timeTable", managerTimeTable);
router.get("/dashboard/allFoodItems", getAllFoodItems);
router.post("/dashboard/getItemRating", getItemRating);
// router.get("/dashboard/allRatings", Authenticate, Authorize, viewRatings);
// router.get("dashboard/ongoingMeal", Authenticate, Authorize, ongoingMeal);

export default router;
