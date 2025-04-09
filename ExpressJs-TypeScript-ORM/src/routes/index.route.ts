import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger";
import { apiKeyAuthenticate, authenticateToken } from "../middleware/auth";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import healthRoute from "./health.route";
import metricsRoute from "./metrics.route";
import apiKeyRoute from "./apiKey.route";
import sendMailRoute from "./sendMail.route"
export const configureRoutes = (app: express.Application) => {
  const apiRouter = express.Router();

  // API Documentation
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Apply the /api/v1 prefix to all routes
  app.use("/api/v1", apiRouter);
  app.use("/api/v1", apiKeyRoute);
  app.use("/api/v1", sendMailRoute);
  // API Routes
  apiRouter.use("/users", authenticateToken, userRoute);
  apiRouter.use("/auth", authRoute);
  apiRouter.use("/health", apiKeyAuthenticate, healthRoute);
  apiRouter.use("/metrics", apiKeyAuthenticate, metricsRoute);
};
