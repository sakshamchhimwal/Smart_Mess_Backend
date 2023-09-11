import express from "express";
import {
  createGuestUserHandler,
  guestCurrentMeal,
  guestTimeTableHandler,
} from "../controllers/guest.controller";
const router = express.Router();

router.post("/createGuest",  createGuestUserHandler);
router.post("/guestTimeTable",  guestTimeTableHandler);
router.get("/guestCurrentMeal",  guestCurrentMeal);

export default router;
