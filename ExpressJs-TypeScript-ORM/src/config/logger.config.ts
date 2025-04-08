import winston from "winston";
import path from "path";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import LogLevel from "../types/LogLevel.type";
import {
  colors,
  emoji,
  levels,
  statusColors,
} from "../constants/statusCodeColor";

dotenv.config();

const logDir = path.join(process.cwd(), "/src/logs");

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info: any) => {
    const message = `${info.timestamp} ${info.level}: ${info.message}`;
    return `${emoji[info.level as LogLevel] || ""} ${message}`;
  })
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: path.join(logDir, "error.log"),
    level: "error",
  }),
  new winston.transports.File({
    filename: path.join(logDir, "all.log"),
  }),
];

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  levels: levels,
  format,
  transports,
});

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const { method, url, ip } = req;

  // Log incoming request
  logger.http(
    `${statusColors.info}➡️ Incoming ${method} ${url} from ${ip}${statusColors.reset}`
  );

  // // Safely log request body if present
  // if (req.body && Object.keys(req.body).length > 0) {
  //   logger.debug(`📦 Request Body: ${JSON.stringify(req.body, null, 2)}`);
  // }

  // Capture response
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    // Choose color based on status code
    let statusColor = statusColors.success;
    if (status >= 500) statusColor = statusColors.error;
    else if (status >= 400) statusColor = statusColors.warn;

    logger.http(
      `${statusColor}⬅️ ${method} ${url} ${status} ${duration}ms - ${ip}${statusColors.reset}`
    );
  });

  next();
};
