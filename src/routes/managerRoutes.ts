// import express from "express";
// import { Authenticate } from "../middlewares/Authenticate";
// import { Authorize } from "../middlewares/Authorize";
// import {
//   createTimeTable,
//   makeAnnouncements,
//   managerTimeTable,
//   ongoingMeal,
//   updateTimeTableHandler,
//   viewRatings,
// } from "../controllers/manager.controller";

// const router = express.Router();

// router.post("/createMenu", Authenticate, Authorize, createTimeTable);
// router.get("/dashboard/managerTimeTable", Authenticate, Authorize, managerTimeTable);
// router.patch("/dashboard/updateTimeTable", Authenticate, Authorize, updateTimeTableHandler);
// router.post("/dashboard/makeAnnouncement", Authenticate, Authorize, makeAnnouncements);
// router.get("/dashboard/allRatings", Authenticate, Authorize, viewRatings);
// router.get("dashboard/ongoingMeal", Authenticate, Authorize, ongoingMeal);
