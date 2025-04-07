// Base libraries
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

// Base routes
import userRoute from "./routes/user.route";
import { connectDB, disconnectDB } from "./database/connect";
// Swagger
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
// Config
import { corsConfig } from "./types/Cors.type";
import { errorHandler } from "./middleware/logger";
import { logger } from "./config/logger.config";
import limiter from "./middleware/rateLimit";

dotenv.config();

const app = express();
// PORT
const PORT = process.env.PORT || 3000;
// Base config
app.use(morgan("tiny", { stream: { write: (message) => logger.http(message.trim()) } }));
app.use(cors(corsConfig));
app.use(limiter)
app.use(helmet());
app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", userRoute);

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});

// Graceful shutdown handling
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    server.close(() => {
      logger.info('HTTP server closed');
    });

    await disconnectDB();
    logger.info('Database connection closed');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}