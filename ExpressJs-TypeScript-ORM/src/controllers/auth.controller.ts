import { Request, Response } from "express";
import statusCode from "../constants/statusCode";
import { User } from "../interfaces/User.interface";
import { loginUserRepositoryByEmail } from "../repositories/user.repository";
import { ErrorType } from "../types/Error.type";
import { ResponseType } from "../types/Response.type";
import { comparePassword, signToken } from "../utils/utils";
import { AuthenticatedRequest } from "../types/AuthenticateRequest.type";
import { redisClient } from "../config/redis.config";
import { cacheTime } from "../constants/redisCacheTime";

const loginUser = async (
  req: Request,
  res: Response<ResponseType<User>>
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await loginUserRepositoryByEmail(email);
    if (!user) {
      res.status(statusCode.NOT_FOUND).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    const isPasswordValid = await comparePassword(
      password,
      user.password || ""
    );
    if (!isPasswordValid) {
      res.status(statusCode.BAD_REQUEST).json({
        status: false,
        message: "Wrong password",
      });
      return;
    }
    const token = signToken(user);
    const response: ResponseType<User> = {
      status: true,
      message: "Login user successfully",
      token: token,
    };
    res.status(statusCode.OK).json(response);
    return;
  } catch (error: any) {
    const response: ResponseType<User> = {
      status: false,
      message: "Failed to login",
      error: (error as ErrorType) ? error.message : "Internal server error",
    };
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
    return;
  }
};

const getProfile = async (
  req: AuthenticatedRequest,
  res: Response<ResponseType<User>>
): Promise<void> => {
  try {
    if (!req.data) {
      res.status(statusCode.UNAUTHORIZED).json({
        status: false,
        message: "Unauthorized",
      });
      return;
    }

    const email = req.data.email;
    const cacheKey = `profile:${email}`;

    // Check if the profile is in the cache
    const cachedProfile = await redisClient.get(cacheKey);
    if (cachedProfile) {
      const response: ResponseType<User> = {
        status: true,
        message: "Profile fetched successfully from cache",
        data: JSON.parse(cachedProfile),
      };
      res.status(statusCode.OK).json(response);
      return;
    }

    // Cache miss: fetch from the database
    const user = await loginUserRepositoryByEmail(email);
    if (!user) {
      res.status(statusCode.NOT_FOUND).json({
        status: false,
        message: "User not found",
      });
      return;
    }

    // Remove sensitive data (e.g., password) before caching
    const userData = { ...user, password: undefined } as User;

    await redisClient.set(cacheKey, JSON.stringify(userData), cacheTime);

    const response: ResponseType<User> = {
      status: true,
      message: "Profile fetched successfully",
      data: userData,
    };
    res.status(statusCode.OK).json(response);
    return;
  } catch (error: any) {
    const response: ResponseType<User> = {
      status: false,
      message: "Failed to fetch profile",
      error: error.message || "Internal server error",
    };
    res
      .status(error.statusCode || statusCode.INTERNAL_SERVER_ERROR)
      .json(response);
    return;
  }
};
export { loginUser, getProfile };
