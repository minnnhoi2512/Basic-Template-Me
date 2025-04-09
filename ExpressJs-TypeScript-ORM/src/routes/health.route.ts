// src/routes/health.route.ts
import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { redisClient } from "../config/redis.config";
import { logger } from "../config/logger.config";
import statusCode from "../constants/statusCode";
import { memoryUsageSys } from "../constants/constants";

const router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const mongoStatus =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    const redisStatus = redisClient.isConnectedStatus()
      ? "connected"
      : "disconnected";

    // Add more health metrics
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    const healthData = {
      status: "OK",
      mongodb: mongoStatus,
      redis: redisStatus,
      uptime: `${Math.floor(uptime)} seconds`,
      memory: {
        heapTotal: `${(memoryUsage.heapTotal / memoryUsageSys / memoryUsageSys).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / memoryUsageSys / memoryUsageSys).toFixed(2)} MB`,
        external: `${(memoryUsage.external / memoryUsageSys / memoryUsageSys).toFixed(2)} MB`,
      },
      processId: process.pid,
      environment: process.env.NODE_ENV || "development",
    };

    // If either MongoDB or Redis is disconnected, mark the status as "degraded"
    if (mongoStatus !== "connected" || redisStatus !== "connected") {
      healthData.status = "DEGRADED";
      res.status(statusCode.OK).json(healthData);
      return;
    }

    res.status(statusCode.OK).json(healthData);
  } catch (error: any) {
    logger.error("Health check failed:", error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: "Health check failed",
      error: error.message,
    });
  }
});

export default router;
