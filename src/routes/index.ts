import { Router, Request, Response, NextFunction } from "express";

/* GET home page. */
export const defaultRouter = Router();

defaultRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.render("index", { title: "Express" });
});
