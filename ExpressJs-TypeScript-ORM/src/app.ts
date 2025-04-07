// Base libraries
import express from "express";
import dotenv from "dotenv";
// Config
import { logger } from "./config/logger.config";
import { connectDB, disconnectDB } from "./database/connect";
import { configureMiddleware } from "./middleware/middleware";
import { configureRoutes } from "./routes/middleware.route";

dotenv.config();

const app = express();
// PORT
const PORT = process.env.PORT || 3000;
// Configure middleware
configureMiddleware(app);

// Configure routes
configureRoutes(app);

const server = app.listen(PORT, async () => {
  try {
    await connectDB();
    logger.info(`Server is running on port ${PORT}`);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
});
// Graceful shutdown handling
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    server.close(() => {
      logger.info("HTTP server closed");
    });

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
