import { Server } from "http";
import { logger } from "../config/logger.config";
import { disconnectDB } from "../database/connect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ms from "ms";
import { redisClient } from "../config/redis.config";

dotenv.config();
/**
 * Handles graceful shutdown of the application.
 * @param server - The HTTP server instance to close.
 * @param signal - The signal that triggered the shutdown (e.g., SIGTERM, SIGINT).
 */
export async function gracefulShutdown(
  server: Server,
  signal: string
): Promise<void> {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    server.close(() => {
      logger.info("HTTP server closed");
    });
    await redisClient.disconnect();
    await disconnectDB();
    logger.info("Database connection closed");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    logger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
}

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const hashedPasswordString = async (
  password: string,
  salt: number | string
): Promise<string> => {
  return await bcrypt.hash(password, salt);
};

/**
 * Signs a JWT token for a user.
 * @param payload - The payload to include in the token (e.g., userId, email).
 * @returns The signed JWT token as a string.
 */
export const signToken = (payload: object): string => {
  const secret = process.env.JWT_SECRET || "DEFAULT_SECRET"; // Ensure fallback works correctly
  const expiresIn = (process.env.JWT_EXPIRES_IN as ms.StringValue) || "1h"; // Default to "1h" if not set

  return jwt.sign(payload, secret, { expiresIn: expiresIn });
};
