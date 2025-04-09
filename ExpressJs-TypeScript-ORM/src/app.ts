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
import { configureRoutes } from "./routes/index.route";
import { gracefulShutdown } from "./utils/utils";
import { queueEmail, startEmailService } from "./services/sendMail.service"; // Import email service
dotenv.config();

// PORT and Environment
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV === "development";
const numCPUs = os.cpus().length; // Number of CPU cores

const debugApp = debug("app");

if (cluster.isPrimary && !isDev) {
  logger.info(`Primary process ${process.pid} is running`);
  debugApp(`Starting primary process with ${numCPUs} CPU cores`);

  // Fork workers for HTTP server (use half the CPUs for the app)
  const appWorkers = Math.ceil(numCPUs / 2);
  for (let i = 0; i < appWorkers; i++) {
    cluster.fork({ WORKER_TYPE: "app" });
  }

  // Fork a worker for the email service
  cluster.fork({ WORKER_TYPE: "email" });

  cluster.on("exit", (worker, code, signal) => {
    logger.warn(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    );
    debugApp(`Worker ${worker.process.pid} exited`);
    logger.info("Starting a new worker...");
    // Restart the same type of worker
    cluster.fork({ WORKER_TYPE: process.env.WORKER_TYPE });
  });
} else {
  if (process.env.WORKER_TYPE === "email" && !isDev) {
    // Start the email service in this worker
    startEmailService();
  } else {
    // Start the HTTP server in this worker
    const app = express();
    // Testing email service dev
    startEmailService();
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
        logger.error("Failed to start server:", error.message);
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
    }
  }
}
