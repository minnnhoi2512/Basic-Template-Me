import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger";
import { authenticateToken } from "../middleware/auth";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import healthRoute from "./health.route";
import metricsRoute from "./metrics.route";

export const configureRoutes = (app: express.Application) => {
  const apiRouter = express.Router();

  // API Documentation
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Apply the /api/v1 prefix to all routes
  app.use("/api/v1", apiRouter);
  // API Routes
  apiRouter.use("/users", authenticateToken, userRoute);
  apiRouter.use("/auth", authRoute);
  apiRouter.use("/health", healthRoute);
  apiRouter.use("/metrics", metricsRoute);


};
