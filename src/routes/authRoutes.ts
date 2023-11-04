//Purpose : auth API routes
import express from "express";
const router = express.Router();
import { webSigninHandler ,androidSigninHandler} from "../controllers/auth.controller";

//api to signin for web
router.post("/signin/web", webSigninHandler);

router.post("/signin/android", androidSigninHandler);

//api to login for android



export default router;