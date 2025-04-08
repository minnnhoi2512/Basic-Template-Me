// Base libraries
import express from "express";
import dotenv from "dotenv";
import cluster from "cluster";
import os from "os";
import debug from "debug"; 
// Config
import { redisClient } from "./config/redis.config";
import { logger } from "./config/logger.config";
import { connectDB } from "./database/connect";
import { configureMiddleware } from "./middleware/middleware";
import { configureRoutes } from "./routes/middleware.route";
import { gracefulShutdown } from "./utils/utils";

dotenv.config();

// PORT and Environment
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV === "development";
const numCPUs = os.cpus().length; // Number of CPU cores

// Debug logger (namespace: app)
const debugApp = debug("app"); // Usage: DEBUG=app node src/index.js to enable

if (cluster.isPrimary && !isDev) {
  logger.info(`Primary process ${process.pid} is running`);
  debugApp(`Starting primary process with ${numCPUs} CPU cores`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.warn(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    );
    debugApp(`Worker ${worker.process.pid} exited`);
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
      debugApp(`Worker ${process.pid} attempting to connect to DB and Redis`);
      await connectDB();
      await redisClient.connect();
      logger.info(`Worker ${process.pid} started on port ${PORT}`);
      debugApp(`Worker ${process.pid} successfully started`);
    } catch (error: any) {
      logger.error("Failed to start server:", error);
      debugApp(`Worker ${process.pid} failed: ${error.message}`);
      process.exit(1);
    }
  });

  // Graceful shutdown handling
  process.on("SIGTERM", () => gracefulShutdown(server, "SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown(server, "SIGINT"));

  if (isDev) {
    logger.info("Running in development mode with hot-reloading enabled.");
    debugApp("Debug mode active with hot-reloading");
    // Note: Hot-reloading handled by nodemon, debugging via --inspect
  }
}
