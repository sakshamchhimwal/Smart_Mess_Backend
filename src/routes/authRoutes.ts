//Purpose : auth API routes
import express from "express";
const router = express.Router();
import { webSigninHandler } from "../controllers/auth.controller";

//api to signin for web
router.post("/signin/web", webSigninHandler);

//api to login for android



export default router;