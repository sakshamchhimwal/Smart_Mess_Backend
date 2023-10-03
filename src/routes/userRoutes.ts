import express from "express";
import { giveRating, userTimeTable,submitFeedback,webAddNotificationTokenHandler, makeRead } from "../controllers/user.controller";
const userRouter = express.Router();

// router.get("/user/dashboard/feedback", Authenticate, Authorize, feedbackHandler);
// router.get("/user/dashboard/timetable", Authenticate, Authorize, timeTableHandler);
// router.get("/user/dashboard", Authenticate, Authorize, userDetails);
// router.get("/user/notifications", Authenticate, Authorize, userNotifications);
// router.post("/create_user", Authenticate, Authorize, createUser);
userRouter.get("/dashboard/timetable", userTimeTable);
userRouter.post("/dashboard/giveRating", giveRating);
userRouter.post("/dashboard/submitFeedback", submitFeedback);

userRouter.post("/addNotificationToken/web", webAddNotificationTokenHandler);
userRouter.post("/makeRead", makeRead);


export default userRouter;
