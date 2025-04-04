import mongoose from "mongoose";
import { ErrorType } from "../types/Error.type";
import statusCode from "../constants/statusCode";
import e from "express";

const connectDB = async (): Promise<any> => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL as string);
    console.log("MongoDB connected successfully");
    console.log(
      "Server Time Zone:",
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    return connect;
  } catch (error: any) {
    console.log("Failed to connect to MongoDB", error.message);
    throw new ErrorType(
      error.name,
      error.message,
      error.code,
      statusCode.INTERNAL_SERVER_ERROR,
      { originalError: error }
    );
  }
};

export default connectDB;
