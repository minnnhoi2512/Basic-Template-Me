import { User } from "../interfaces/User.interface";

// Define the JwtPayload to match the actual token payload
export interface JwtPayload extends User {
  iat?: number;
  exp?: number;
}