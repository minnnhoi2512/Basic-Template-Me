import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger";
import userRoute from "./user.route";
import authRoute from "./auth.route";

export const configureRoutes = (app: express.Application) => {
  // API Documentation
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // API Routes
  app.use("/api/users", userRoute);

  // Add more routes here
  app.use("/api/auth", authRoute);
};
