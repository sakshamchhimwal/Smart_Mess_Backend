import express from "express";
import { Authenticate } from "../middlewares/Authenticate";
import { Authorize } from "../middlewares/Authorize";
import {
  createGuestUserHandler,
  guestCurrentMeal,
  guestTimeTableHandler,
} from "../controllers/guest.controller";
const router = express.Router();

router.post("/createGuest", Authenticate, Authorize, createGuestUserHandler);
router.get("/guestTimeTable", Authenticate, Authorize, guestTimeTableHandler);
router.get("/guestCurrentMeal", Authenticate, Authorize, guestCurrentMeal);
