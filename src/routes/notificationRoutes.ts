//Purpose : notification API routes
import express from "express";
const router = express.Router();
import { webAddNotificationTokenHandler,getAllNotifications } from "../controllers/notification.controller";

//api to add notification token
router.post("/addNotificationToken/web", webAddNotificationTokenHandler);

//api to fetch all notifications
router.post("/getAllNotifications", getAllNotifications);

//api to make notification read by user
// router.post("/makeRead", makeRead);


export default router;