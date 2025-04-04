import { ErrorType } from "./Error.type"

export interface ResponseType<T> {
    status: boolean;
    message: string;
    data?: T | T[];
    error?: string | ErrorType;
  }