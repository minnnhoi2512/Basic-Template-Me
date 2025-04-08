// src/routes/health.route.ts
import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { redisClient } from "../config/redis.config";
import statusCode from "../constants/statusCode";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const redisStatus = redisClient.isConnectedStatus()
    ? "connected"
    : "disconnected";
  res.status(statusCode.OK).json({
    status: true,
    mongodb: mongoStatus,
    redis: redisStatus,
  });
});

export default router;
