import { Request, Response } from "express";
import statusCode from "../constants/statusCode";
import { User } from "../interfaces/User.interface";
import { loginUserRepositoryByEmail } from "../repositories/user.repository";
import { ErrorType } from "../types/Error.type";
import { ResponseType } from "../types/Response.type";
import { comparePassword, signToken } from "../utils/utils";
import { AuthenticatedRequest } from "../types/AuthenticateRequest.type";

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

const getProfile = async (
  req: AuthenticatedRequest,
  res: Response<ResponseType<User>>
) => {
  try {
    const user = await loginUserRepositoryByEmail(
      req.data?.email as string
    );
    if (!user) {
      res.status(statusCode.NOT_FOUND).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    const response: ResponseType<User> = {
      status: true,
      message: "Profile fetched successfully",
      data: { ...user, password: "**************" },
    };
    res.status(statusCode.OK).json(response);
  } catch (error: any) {
    const response: ResponseType<User> = {
      status: false,
      message: "Failed to get profile",
      error: (error as ErrorType) ? error.message : "Internal server error",
    };
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
  }
};
export { loginUser, getProfile };
