import mongoose, {Schema} from "mongoose";
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
	},
	Phone_Number: {
		type: Number,
		required: true,
		length: 10,
	},
	Role: {
		type: String, //"user"/"admin"/"manager"/"guest"
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
		type: Schema.Types.ObjectId,
		ref: "Mess",
		required: true,
	},
});

export default mongoose.model("User_Schema", User);
