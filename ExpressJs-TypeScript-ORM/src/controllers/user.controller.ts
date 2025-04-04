import { Request, Response } from "express";
import { User } from "../interfaces/User.interface";
import { ErrorType } from "../types/Error.type";
import { ResponseType } from "../types/Response.type";
import statusCode from "../constants/statusCode";
import {
  createUserRepository,
  getUserByIdRepository,
  getUsersRepository,
  updateStatusUserRepository,
  updateUserOneFieldRepository,
  updateUserRepository,
} from "../repositories/user.repository";
import statusEnum from "../enums/Status.enum";

const getUsers = async (req: Request, res: Response<ResponseType<User>>) => {
  try {
    const users = await getUsersRepository();
    const response: ResponseType<User> = {
      status: true,
      message: "User fetched successfully",
      data: users ? users : [],
    };
    res.status(statusCode.OK).json(response);
  } catch (error: any) {
    const response: ResponseType<User> = {
      status: false,
      message: "Failed to fetch users",
      error: (error as ErrorType) ? error.message : "Internal server error",
    };
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
  }
};
const createUser = async (req: Request, res: Response<ResponseType<User>>) => {
  try {
    const user: User = req.body;
    const newUser = await createUserRepository(user);
    const response: ResponseType<User> = {
      status: true,
      message: "User created successfully",
      data: newUser,
    };
    res.status(statusCode.CREATED).json(response);
  } catch (error: any) {
    let response: ResponseType<User>;

    if (error.name === "ValidationError") {
      response = {
        status: false,
        message: "Validation error",
        error: error.message,
      };
      res.status(statusCode.BAD_REQUEST).json(response);
      return;
    }

    if (error.code === 11000) {
      response = {
        status: false,
        message: "Duplicate key error: User already exists",
        error: error.message,
      };
      res.status(statusCode.CONFLICT).json(response); // 409 Conflict
      return;
    }

    response = {
      status: false,
      message: "Failed to create user",
      error: error.message || "Internal server error",
    };
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
  }
};

const getUserById = async (req: Request, res: Response<ResponseType<User>>) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdRepository(id);
    if (!user) {
      res.status(statusCode.NOT_FOUND).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    const response: ResponseType<User> = {
      status: true,
      message: "User fetched successfully",
      data: user,
    };
    res.status(statusCode.OK).json(response);
  } catch (error: any) {
    const response: ResponseType<User> = {
      status: false,
      message: "Failed to fetch user",
      error: (error as ErrorType) ? error.message : "Internal server error",
    };
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
  }
};

const updateUserById = async (
  req: Request,
  res: Response<ResponseType<User>>
) => {
  try {
    const { id } = req.params;
    const user: User = req.body;
    const updatedUser = await updateUserRepository({ ...user, _id: id });
    if (!updatedUser) {
      res.status(statusCode.NOT_FOUND).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    const response: ResponseType<User> = {
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    };
    res.status(statusCode.OK).json(response);
  } catch (error: any) {
    let response: ResponseType<User>;

    if (error.name === "ValidationError") {
      response = {
        status: false,
        message: "Validation error",
        error: error.message,
      };
      res.status(statusCode.BAD_REQUEST).json(response);
      return;
    }

    if (error.code === 11000) {
      response = {
        status: false,
        message: "Duplicate key error: User already exists",
        error: error.message,
      };
      res.status(statusCode.CONFLICT).json(response); // 409 Conflict
      return;
    }

    response = {
      status: false,
      message: "Failed to update user",
      error: error.message || "Internal server error",
    };
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
  }
};

const updateUserOneField = async (
  req: Request,
  res: Response<ResponseType<User>>
) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;
    const updatedUser = await updateUserOneFieldRepository(id, field, value);
    if (!updatedUser) {
      res.status(statusCode.NOT_FOUND).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    const response: ResponseType<User> = {
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    };
    res.status(statusCode.OK).json(response);
  } catch (error: any) {
    let response: ResponseType<User>;

    if (error.name === "ValidationError") {
      response = {
        status: false,
        message: "Validation error",
        error: error.message,
      };
      res.status(statusCode.BAD_REQUEST).json(response);
      return;
    }

    if (error.code === 11000) {
      response = {
        status: false,
        message: "Duplicate key error: User already exists",
        error: error.message,
      };
      res.status(statusCode.CONFLICT).json(response); // 409 Conflict
      return;
    }

    response = {
      status: false,
      message: "Failed to update user",
      error: error.message || "Internal server error",
    };
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
  }
};

const updateStatusUser = async (
  req: Request,
  res: Response<ResponseType<User>>
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (status !== statusEnum.ACTIVE && status !== statusEnum.INACTIVE) {
      res.status(statusCode.BAD_REQUEST).json({
        status: false,
        message:
          "Invalid status value. Allowed values are 'active' or 'inactive'.",
      });
      return;
    }
    const updatedUser = await updateStatusUserRepository(id, status);
    if (!updatedUser) {
      res.status(statusCode.NOT_FOUND).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    const response: ResponseType<User> = {
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    };
    res.status(statusCode.OK).json(response);
  } catch (error: any) {
    let response: ResponseType<User>;

    if (error.name === "ValidationError") {
      response = {
        status: false,
        message: "Validation error",
        error: error.message,
      };
      res.status(statusCode.BAD_REQUEST).json(response);
      return;
    }

    if (error.code === 11000) {
      response = {
        status: false,
        message: "Duplicate key error: User already exists",
        error: error.message,
      };
      res.status(statusCode.CONFLICT).json(response); // 409 Conflict
      return;
    }

    response = {
      status: false,
      message: "Failed to update user",
      error: error.message || "Internal server error",
    };
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
  }
};
export {
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  updateUserOneField,
  updateStatusUser
};
