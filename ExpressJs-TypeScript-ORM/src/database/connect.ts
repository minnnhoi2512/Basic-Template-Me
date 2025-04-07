import mongoose from "mongoose";
import { ErrorType } from "../types/Error.type";
import statusCode from "../constants/statusCode";

let connection: typeof mongoose | null = null;

export const connectDB = async (): Promise<typeof mongoose | null> => {
  try {
    connection = await mongoose.connect(process.env.MONGO_URL as string);
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
