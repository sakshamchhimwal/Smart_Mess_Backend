//Purpose : feedback API routes
import express from "express";
import { getAllfeedbacks } from "../controllers/feedback.controller";
const router = express.Router();


router.post("/getAllfeedbacks", getAllfeedbacks);





export default router;