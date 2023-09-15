//Purpose : auth API routes
import express from "express";
const router = express.Router();
import { webSigninHandler, testHandler } from "../controllers/auth.controller";

//api to signin for web
router.post("/signin/web", webSigninHandler);

//api to login for android

//api to test
router.post("/test", testHandler);

export default router;