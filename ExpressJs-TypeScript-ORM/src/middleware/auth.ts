import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/Jwt.type";
import { ResponseType } from "../types/Response.type";
import statusCode from "../constants/statusCode";
import { AuthenticatedRequest } from "../types/AuthenticateRequest.type";

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
