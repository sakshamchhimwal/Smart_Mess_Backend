import dotenv from "dotenv";
dotenv.config();
import { connect } from "mongoose";

const connectDB = async () => {
  try {
    const conn = await connect("mongodb://localhost:27017");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
