import {
  createUser,
  feedbackHandler,
  timeTableHandler,
  userDetails,
  userNotifications,
} from "../controllers/user.controller";
import { Authenticate } from "../middlewares/Authenticate";
import { Authorize } from "../middlewares/Authorize";

import express from "express";
const router = express.Router();

router.get("/user/dashboard/feedback", Authenticate, Authorize, feedbackHandler);
router.get("/user/dashboard/timetable", Authenticate, Authorize, timeTableHandler);
router.get("/user/dashboard", Authenticate, Authorize, userDetails);
router.get("/user/notifications", Authenticate, Authorize, userNotifications);
router.post("/create_user", Authenticate, Authorize, createUser);

export default router;
