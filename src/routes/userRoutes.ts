import express from "express";
import { userTimeTable } from "../controllers/user.controller";
const userRouter = express.Router();

// router.get("/user/dashboard/feedback", Authenticate, Authorize, feedbackHandler);
// router.get("/user/dashboard/timetable", Authenticate, Authorize, timeTableHandler);
// router.get("/user/dashboard", Authenticate, Authorize, userDetails);
// router.get("/user/notifications", Authenticate, Authorize, userNotifications);
// router.post("/create_user", Authenticate, Authorize, createUser);
userRouter.get("/user/dashboard/timetable", userTimeTable);

export default userRouter;
