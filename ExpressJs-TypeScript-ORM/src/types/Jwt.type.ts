import { User } from "../interfaces/User.interface";

export interface JwtPayload {
    user : User
    iat?: number;
    exp?: number;
  }