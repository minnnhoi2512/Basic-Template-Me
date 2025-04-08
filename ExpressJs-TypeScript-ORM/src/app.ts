// Base libraries
import express from "express";
import dotenv from "dotenv";
// Config
import { logger } from "./config/logger.config";
import { connectDB, disconnectDB } from "./database/connect";
import { configureMiddleware } from "./middleware/middleware";
import { configureRoutes } from "./routes/middleware.route";
import { gracefulShutdown } from "./utils/utils";

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
process.on("SIGTERM", () => gracefulShutdown(server, "SIGTERM"));
process.on("SIGINT", () => gracefulShutdown(server, "SIGINT"));


