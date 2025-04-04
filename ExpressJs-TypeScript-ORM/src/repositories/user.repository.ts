import { User } from "../interfaces/User.interface";
import UserModel from "../models/User.model";
import { ErrorType } from "../types/Error.type";

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
    const newUser = await UserModel.create(user);
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

const updateUserRepository = async (User: User): Promise<User | null> => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(User._id, User, {
      new: true,
    })
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
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { [field]: value },
      { new: true }
    )
      .select("-password")
      .lean();
    return updatedUser as User;
  } catch (error: any) {
    throw new ErrorType(error.name, error.message, error.code);
  }
}

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
}
export {
  getUsersRepository,
  createUserRepository,
  getUserByIdRepository,
  updateUserRepository,
  updateUserOneFieldRepository,
  updateStatusUserRepository,
};
