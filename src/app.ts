import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

import createHttpError, { CreateHttpError } from "http-errors";
import express, { Express, Request, Response, NextFunction } from "express";
import logger from "morgan";
import path from "path";
import { defaultRouter } from "./routes";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { Authenticate } from "./middlewares/Authenticate";
import { Authorize } from "./middlewares/Authorize";

import connectDB from "./config/connectDB";


var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//connect to database
connectDB();

app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(createHttpError);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", defaultRouter);
app.use("/auth", authRouter);
// app.use("/guest")
// app.use(Authenticate);
app.use(Authorize);
app.use("/user", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});

//exporting app to be used in test
export default app;
