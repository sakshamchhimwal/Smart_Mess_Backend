import cors from "cors";
import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import logger from "morgan";
import path from "path";
dotenv.config({ path: __dirname + "/.env" });
// import { defaultRouter } from "./routes";
import cookieParser from "cookie-parser";
import { Authenticate } from "./middlewares/Authenticate";
import authRouter from "./routes/authRoutes";
import guestRouter from "./routes/guestRoutes";
import managerRoutes from "./routes/managerRoutes";
import userRouter from "./routes/userRoutes";
// import { Authorize } from "./middlewares/Authorize";
import connectDB from "./config/connectDB";
// import notifications from "./models/notifications";
import User_Schema from "./models/user"; // Adjust the import path according to your project structure
import Analytics from "./models/analytics";

import { rateLimit } from "express-rate-limit";
import schedule from "node-schedule";
import backup from "./config/backupTimeSeriesData";

const job = schedule.scheduleJob("0 23 * * *", async function () {
	console.log("Backing UP");
	await backup();
});

// const lob = schedule.scheduleJob('*/1 * * * *', function () {
//   console.log(Date.now(), 'The answer to life, the universe, and everything!');
// });

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
	standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
});

import { createServer } from "http";
import { Server } from "socket.io";
import { startIOLoop } from "./services/sockets";

var app = express();

//connect to database
connectDB();

// app.use(limiter);
app.use(cors());
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//serve files of path /static
app.use("/api/static", express.static(path.join(__dirname, "..", "public")));

app.use("/api/auth", authRouter);
app.use("/api/guest", guestRouter);

app.use(Authenticate()); //all the routes below this will be authenticated
//app.use(Authorize()); //only the below routes have to be authorized

app.use("/api/user", userRouter);
app.use("/api/manager", managerRoutes);


app.get("/api/usercount", async (req: Request, res: Response) => {
  try {
    const count = await User_Schema.countDocuments({}); // Get the count of all user documents
    res.status(200).json({ count }); // Send the count in a JSON object
  } catch (error) {
    console.error("Error fetching users count:", error);
    res.status(500).send("An error occurred while fetching the count of users.");
  }
});
app.get("/api/userstats", async (req: Request, res: Response) => {
  try {
    // Fetch all analytics data sorted by date
    const allAnalytics = await Analytics.find({}).sort({ date: 1 });
    // Optionally, format data before sending
    const formattedData = allAnalytics.map(entry => ({
      date: entry.date,
      visitors: entry.uniqueVisitorsCount,
    }));
    console.log(formattedData);
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    res.status(500).send('Internal Server Error');
  }
}); 
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



const server = app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});

const io = new Server(server, {
	cors: {
		origin: "*"
	}
});

startIOLoop(io);

//exporting app to be used in test
// export default app;
