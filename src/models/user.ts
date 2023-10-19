import mongoose, { Schema } from "mongoose";
import Mess from "./mess";

const User = new Schema({
	Username: {
		type: String,
		required: true,
	},
	Email: {
		type: String,
		unique: true,
		required: true,
		indexedDB: true,
	},
	Phone_Number: {
		type: Number,
		required: true,
		length: 10,
	},
	Role: {
		type: String, //"user"/"admin"/"manager"/"guest"
		enum: ["user", "admin", "manager", "guest"],
		default: "user",
	},
	First_Name: {
		type: String,
		required: true,
	},
	Last_Name: {
		type: String,
		required: true,
	},
	Image: {
		type: String,
	},
	Last_Login: {
		type: Date,
	},
	Eating_Mess: {
		type: mongoose.Types.ObjectId,
		ref: "Mess",
		default: new mongoose.Types.ObjectId("64fe052e15720924b85bd58d")
	},
});

export default mongoose.model("User_Schema", User);
