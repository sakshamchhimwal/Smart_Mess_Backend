require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
export const getTimeTable = express.Router();

getTimeTable.get("/timetable", (req: Request, res: Response, next: NextFunction) => {});
