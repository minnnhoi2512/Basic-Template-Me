import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger";
import { authenticateToken } from "../middleware/auth";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import healthRoute from "./health.route";
import metricsRoute from "./metrics.route";
export const configureRoutes = (app: express.Application) => {
  // API Documentation
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // API Routes
  app.use("/users", authenticateToken, userRoute);

  // Add more routes here

  app.use("/health", healthRoute);
  app.use("/metrics", metricsRoute);
  app.use("/api/auth", authRoute);
};
