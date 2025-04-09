import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/Jwt.type";
import { ResponseType } from "../types/Response.type";
import statusCode from "../constants/statusCode";
import { AuthenticatedRequest } from "../types/AuthenticateRequest.type";
import { redisClient } from "../config/redis.config";

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response<ResponseType<null>>,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    const response: ResponseType<null> = {
      status: false,
      message: "Unauthorized: No token provided",
    };
    res.status(statusCode.UNAUTHORIZED).json(response);
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.data = decoded;
    next();
  } catch (error: any) {
    let errorMessage = "Unauthorized: Invalid token";
    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = "Unauthorized: Token expired";
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = "Unauthorized: Invalid token";
    }

    const response: ResponseType<null> = {
      status: false,
      message: errorMessage,
    };
    res.status(statusCode.UNAUTHORIZED).json(response);
    return;
  }
};

export const apiKeyAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers["x-api-key"] as string; // Type assertion for safety
    if (!apiKey) {
      res.status(statusCode.UNAUTHORIZED).json({ message: "Missing API key" });
      return;
    }

    // Fetch the stored value using the correct key
    const storedValue = await redisClient.get(`api_key:${apiKey}`);
    if (!storedValue) {
      res.status(statusCode.UNAUTHORIZED).json({ message: "Invalid API key" });
      return;
    }

    // Split the stored value (format: "userId-apiKey")
    const [_storedUserId, storedApiKey] = storedValue.split("-");
    if (storedApiKey !== apiKey) {
      res
        .status(statusCode.FORBIDDEN)
        .json({ message: "API key mismatch", userId: _storedUserId });
      return;
    }

    next();
  } catch (error: any) {
    res
      .status(statusCode.UNAUTHORIZED)
      .json({ message: "Unauthorized", detail: error.message });
    return;
  }
};
