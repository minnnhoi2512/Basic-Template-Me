import { User } from "../interfaces/User.interface";
import UserModel from "../models/User.model";
import { ErrorType } from "../types/Error.type";
import { hashedPasswordString } from "../utils/utils";

const getUsersRepository = async (): Promise<User[]> => {
  try {
    const users = await UserModel.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    return users as User[];
  } catch (error: any) {
    throw new ErrorType(error.name, error.message, error.code);
  }
};

const createUserRepository = async (user: User): Promise<User> => {
  try {
    const hashedPassword = await hashedPasswordString(user.password || "", 10);
    const newUser = await UserModel.create({
      ...user,
      password: hashedPassword,
    });
    return newUser as User;
  } catch (error: any) {
    throw new ErrorType(error.name, error.message, error.code);
  }
};

const getUserByIdRepository = async (id: string): Promise<User | null> => {
  try {
    const user = await UserModel.findById(id).select("-password").lean();
    return user as User;
  } catch (error: any) {
    throw new ErrorType(error.name, error.message, error.code);
  }
};

const updateUserRepository = async (user: User): Promise<User | null> => {
  try {
    const hashedPassword = await hashedPasswordString(user.password || "", 10);
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { ...user, password: hashedPassword },
      {
        new: true,
      }
    )
      .select("-password")
      .lean();
    return updatedUser as User;
  } catch (error: any) {
    throw new ErrorType(error.name, error.message, error.code);
  }
};

const updateUserOneFieldRepository = async (
  id: string,
  field: string,
  value: any
): Promise<User | null> => {
  try {
    // If the field is "password", hash the value
    const updateData = field === "password"
      ? { [field]: await hashedPasswordString(value || "", 10) }
      : { [field]: value };

    // Update the user and exclude the password field in the result
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .select("-password")
      .lean();

    return updatedUser as User;
  } catch (error: any) {
    throw new ErrorType(error.name, error.message, error.code);
  }
};

const updateStatusUserRepository = async (
  id: string,
  status: "active" | "inactive"
): Promise<User | null> => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .select("-password")
      .lean();
    return updatedUser as User;
  } catch (error: any) {
    throw new ErrorType(error.name, error.message, error.code);
  }
};

const loginUserRepositoryByEmail = async (
  email: string
): Promise<User | null> => {
  try {
    const user = await UserModel.findOne({ email: email }).lean();
    return user as User;
  } catch (error: any) {
    throw new ErrorType(error.name, error.message, error.code);
  }
};
export {
  getUsersRepository,
  createUserRepository,
  getUserByIdRepository,
  updateUserRepository,
  updateUserOneFieldRepository,
  updateStatusUserRepository,
  loginUserRepositoryByEmail,
};
