import express from "express";

const router = express.Router();
// import { Authenticate } from "../middlewares/Authenticate";
// import { Authorize } from "../middlewares/Authorize";
import {
	createNewFoodItem, createTimeTable,
	makeAnnouncements,
} from "../controllers/manager.controller";


// router.post("/createMenu", Authenticate, Authorize, createTimeTable);
// router.get("/dashboard/managerTimeTable", Authenticate, Authorize, managerTimeTable);
// router.patch("/dashboard/updateTimeTable", Authenticate, Authorize, updateTimeTableHandler);
router.post("/dashboard/makeAnnouncement", makeAnnouncements);
router.put("/dashboard/createFoodItem", createNewFoodItem);
router.patch("/dashboard/createTimeTable", createTimeTable);
// router.get("/dashboard/allRatings", Authenticate, Authorize, viewRatings);
// router.get("dashboard/ongoingMeal", Authenticate, Authorize, ongoingMeal);

export default router;
