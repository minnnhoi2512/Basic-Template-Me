import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { corsConfig } from "../types/Cors.type";
import { errorHandler } from "./logger";
import { requestLogger } from "../config/logger.config";
import limiter from "./rateLimit";
import compression from "compression";

export const configureMiddleware = (app: Application) => {
  // Logging middleware must be first
  app.use(requestLogger);

  // Body parsing middleware
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Security middleware
  app.use(helmet());
  app.use(cors(corsConfig));
  app.use(limiter);

  // Error handler should be last
  app.use(errorHandler);
};
