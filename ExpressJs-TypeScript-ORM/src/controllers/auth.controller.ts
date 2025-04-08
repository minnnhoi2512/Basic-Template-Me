import { Request, Response } from "express";
import statusCode from "../constants/statusCode";
import { User } from "../interfaces/User.interface";
import { loginUserRepositoryByEmail } from "../repositories/user.repository";
import { ErrorType } from "../types/Error.type";
import { ResponseType } from "../types/Response.type";
import { comparePassword, signToken } from "../utils/utils";
import { AuthenticatedRequest } from "../types/AuthenticateRequest.type";
import { redisClient } from "../config/redis.config";
import { logger } from "../config/logger.config";

const loginUser = async (req: Request, res: Response<ResponseType<User>>) => {
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
  } catch (error: any) {
    const response: ResponseType<User> = {
      status: false,
      message: "Failed to login",
      error: (error as ErrorType) ? error.message : "Internal server error",
    };
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
  }
};

// const getProfile = async (
//   req: AuthenticatedRequest,
//   res: Response<ResponseType<User>>
// ) => {
//   try {
//     const user = await loginUserRepositoryByEmail(
//       req.data?.email as string
//     );
//     if (!user) {
//       res.status(statusCode.NOT_FOUND).json({
//         status: false,
//         message: "User not found",
//       });
//       return;
//     }
//     const response: ResponseType<User> = {
//       status: true,
//       message: "Profile fetched successfully",
//       data: { ...user, password: "**************" },
//     };
//     res.status(statusCode.OK).json(response);
//   } catch (error: any) {
//     const response: ResponseType<User> = {
//       status: false,
//       message: "Failed to get profile",
//       error: (error as ErrorType) ? error.message : "Internal server error",
//     };
//     res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
//   }
// };
const getProfile = async (
  req: AuthenticatedRequest,
  res: Response<ResponseType<User>>
): Promise<any> => {
  try {
    if (!req.data) {
      throw new Error();
    }

    const email = req.data.email;
    const cacheKey = `profile:${email}`;

    // Check if the profile is in the cache
    const cachedProfile = await redisClient.get(cacheKey);
    if (cachedProfile) {
      logger.info(`Cache hit for profile: ${email}`);
      const response: ResponseType<User> = {
        status: true,
        message: "Profile fetched successfully from cache",
        data: JSON.parse(cachedProfile),
      };
      return res.status(200).json(response);
    }

    // Cache miss: fetch from the database
    logger.info(`Cache miss for profile: ${email}`);
    const user = await loginUserRepositoryByEmail(email);
    if (!user) {
      // throw new ErrorType("User not found", 404);
    }

    // Remove sensitive data (e.g., password) before caching
    const userData = { ...user, password: undefined } as User;

    // Store the profile in the cache with a TTL of 1 hour (3600 seconds)
    await redisClient.set(cacheKey, JSON.stringify(userData), 3600);

    const response: ResponseType<User> = {
      status: true,
      message: "Profile fetched successfully",
      data: userData,
    };
    res.status(200).json(response);
  } catch (error: any) {
    const response: ResponseType<User> = {
      status: false,
      message: "Failed to fetch profile",
      error: error.message || "Internal server error",
    };
    res.status(error.statusCode || 500).json(response);
  }
};
export { loginUser, getProfile };
