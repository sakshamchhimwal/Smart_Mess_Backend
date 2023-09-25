//Purpose : notification API routes
import express from "express";
const router = express.Router();
import { webAddNotificationTokenHandler } from "../controllers/notification.controller";

//api to add notification token
router.post("/addNotificationToken/web", webAddNotificationTokenHandler);


export default router;