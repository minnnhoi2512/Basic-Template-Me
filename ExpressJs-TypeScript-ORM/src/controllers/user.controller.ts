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
import { validateEmail, validatePassword } from "../validation/validator";

const getUsers = async (
  req: Request,
  res: Response<ResponseType<User>>
): Promise<void> => {
  try {
    const users = await getUsersRepository();
    const response: ResponseType<User> = {
      status: true,
      message: "User fetched successfully",
      data: users ? users : [],
    };
    res.status(statusCode.OK).json(response);
    return;
  } catch (error: any) {
    const response: ResponseType<User> = {
      status: false,
      message: "Failed to fetch users",
      error: (error as ErrorType) ? error.message : "Internal server error",
    };
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
    return;
  }
};
const createUser = async (
  req: Request,
  res: Response<ResponseType<User>>
): Promise<void> => {
  try {
    const { password, email } = req.body;
    if (password && password.trim() !== "") {
      // Validate password format
      if (!validatePassword(password)) {
        res.status(statusCode.BAD_REQUEST).json({
          status: false,
          message:
            "At least 6 characters, 1 letter and 1 number, no special characters",
        });
        return;
      }
    }
    if (email && email.trim() !== "") {
      // Validate email format
      if (!validateEmail(email)) {
        res.status(statusCode.BAD_REQUEST).json({
          status: false,
          message: "Invalid email format",
        });
        return;
      }
    }
    const user: User = req.body;
    const newUser = await createUserRepository(user);
    const response: ResponseType<User> = {
      status: true,
      message: "User created successfully",
      data: newUser,
    };
    res.status(statusCode.CREATED).json(response);
    return;
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
    return;
  }
};

const getUserById = async (
  req: Request,
  res: Response<ResponseType<User>>
): Promise<void> => {
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
    return;
  } catch (error: any) {
    const response: ResponseType<User> = {
      status: false,
      message: "Failed to fetch user",
      error: (error as ErrorType) ? error.message : "Internal server error",
    };
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
    return;
  }
};

const updateUserById = async (
  req: Request,
  res: Response<ResponseType<User>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, password, email } = req.body;

    // Prepare the update object by excluding null or empty fields
    const updateData: Partial<User> = {};
    if (name && name.trim() !== "") updateData.name = name;
    if (password && password.trim() !== "") {
      // Validate password format
      if (!validatePassword(password)) {
        res.status(statusCode.BAD_REQUEST).json({
          status: false,
          message:
            "At least 6 characters, 1 letter and 1 number, no special characters",
        });
        return;
      }
      updateData.password = password;
    }
    if (email && email.trim() !== "") {
      // Validate email format
      if (!validateEmail(email)) {
        res.status(statusCode.BAD_REQUEST).json({
          status: false,
          message: "Invalid email format",
        });
        return;
      }
      updateData.email = email;
    }

    // If no valid fields are provided, return a bad request response
    if (Object.keys(updateData).length === 0) {
      res.status(statusCode.BAD_REQUEST).json({
        status: false,
        message: "No valid fields provided for update",
      });
      return;
    }

    // Update user
    const updatedUser = await updateUserRepository({
      ...updateData,
      _id: id,
    } as User);

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
    return;
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
    return;
  }
};

const updateUserOneField = async (
  req: Request,
  res: Response<ResponseType<User>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;
    if (field === "email") {
      if (!validateEmail(value)) {
        res.status(statusCode.BAD_REQUEST).json({
          status: false,
          message: "Invalid email format",
        });
        return;
      }
    } else if (field === "password") {
      if (!validatePassword(value)) {
        res.status(statusCode.BAD_REQUEST).json({
          status: false,
          message:
            "At least 6 characters, 1 letter and 1 number, no special characters",
        });
        return;
      }
    }
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
    return;
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
    return;
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
    return;
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
    return;
  }
};

export {
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  updateUserOneField,
  updateStatusUser,
};
