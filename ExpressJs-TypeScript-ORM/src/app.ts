// Base libraries
import express from "express";
import dotenv from "dotenv";
import cluster from "cluster";
import os from "os";
// Config
import { redisClient } from "./config/redis.config";
import { logger } from "./config/logger.config";
import { connectDB } from "./database/connect";
import { configureMiddleware } from "./middleware/middleware";
import { configureRoutes } from "./routes/middleware.route";
import { gracefulShutdown } from "./utils/utils";

dotenv.config();
// PORT
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV === "development";
const numCPUs = os.cpus().length; // Number of CPU cores
if (cluster.isPrimary && !isDev) {
  logger.info(`Primary process ${process.pid} is running`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.warn(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    );
    logger.info("Starting a new worker...");
    cluster.fork(); // Restart a worker if it dies
  });
} else {
  const app = express();

  // Configure middleware
  configureMiddleware(app);

  // Configure routes
  configureRoutes(app);

  const server = app.listen(PORT, async () => {
    try {
      await connectDB();
      await redisClient.connect();
      logger.info(`Worker ${process.pid} started.`);
    } catch (error) {
      logger.error("Failed to start server:", error);
      process.exit(1);
    }
  });

  // Graceful shutdown handling
  process.on("SIGTERM", () => gracefulShutdown(server, "SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown(server, "SIGINT"));

  if (isDev) {
    logger.info("Running in development mode with hot-reloading enabled.");
    // Note: Actual hot-reloading is handled by nodemon via script, not code
  }
}
