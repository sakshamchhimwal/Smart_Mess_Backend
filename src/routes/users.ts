import { NextFunction, Router, Response, Request } from "express";

/* GET users listing. */
export const usersRouter = Router();
usersRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("respond with a resource");
});
