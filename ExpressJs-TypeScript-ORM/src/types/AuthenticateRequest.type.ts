import { Request } from "express";
import { JwtPayload } from "./Jwt.type";

export interface AuthenticatedRequest extends Request {
  data?: JwtPayload;
}