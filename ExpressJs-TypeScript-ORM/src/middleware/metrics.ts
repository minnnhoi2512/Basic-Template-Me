import { Request, Response, NextFunction } from "express";
import { httpRequestDuration, totalRequests } from "../config/metrics.config";

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    const route = req.route ? req.route.path : req.path;

    // Record request duration
    httpRequestDuration
      .labels(req.method, route, res.statusCode.toString())
      .observe(durationInSeconds);

    // Increment total requests counter
    totalRequests.labels(req.method, route, res.statusCode.toString()).inc();
  });

  next();
};
