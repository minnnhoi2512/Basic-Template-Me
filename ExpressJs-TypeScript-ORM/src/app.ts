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

dotenv.config();

const app = express();
// PORT
const PORT = process.env.PORT || 3000;
// Base config
app.use(morgan("tiny"));
app.use(cors(corsConfig));
app.use(helmet());
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
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  try {
    // Close the HTTP server
    server.close(() => {
      console.log("HTTP server closed");
    });

    await disconnectDB();
    console.log("Database connection closed");
    // Add appropriate timeout for existing connections to finish
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
}
