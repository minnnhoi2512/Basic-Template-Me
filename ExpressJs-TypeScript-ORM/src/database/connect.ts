import mongoose from "mongoose";
import { ErrorType } from "../types/Error.type";
import statusCode from "../constants/statusCode";
import {
  connectTimeoutMS,
  maxPoolSize,
  minPoolSize,
  socketTimeoutMS,
} from "../constants/dbConstants";

let connection: typeof mongoose | null = null;

export const connectDB = async (): Promise<typeof mongoose | null> => {
  try {
    connection = await mongoose.connect(process.env.MONGO_URL as string, {
      maxPoolSize: maxPoolSize, 
      minPoolSize: minPoolSize, 
      connectTimeoutMS: connectTimeoutMS,
      socketTimeoutMS: socketTimeoutMS,
      autoIndex: process.env.NODE_ENV !== "production",
    });
    return connection;
  } catch (error: any) {
    throw new ErrorType(
      error.name,
      error.message,
      error.code,
      statusCode.INTERNAL_SERVER_ERROR,
      { originalError: error }
    );
  }
};

export const getConnection = (): typeof mongoose | null => connection;
export const disconnectDB = async (): Promise<void> => {
  if (connection) {
    await connection.disconnect();
    connection = null;
  }
};
