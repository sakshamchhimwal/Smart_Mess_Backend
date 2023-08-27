//Purpose : auth API routes
import express from "express";
const router = express.Router();
import { signupHandler, loginHandler } from "../controllers/auth.controller";

//api to signup
router.post("/signup", signupHandler);

//api to login
router.post("/login", loginHandler);

export default router;