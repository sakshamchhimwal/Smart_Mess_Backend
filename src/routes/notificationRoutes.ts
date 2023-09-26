//Purpose : notification API routes
import express from "express";
const router = express.Router();
import { webAddNotificationTokenHandler,viewNotifications } from "../controllers/notification.controller";

//api to add notification token
router.post("/addNotificationToken/web", webAddNotificationTokenHandler);

//api to fetch all notifications
router.post("/viewNotifications", viewNotifications);

//api to make notification read by user
// router.post("/makeRead", makeRead);


export default router;