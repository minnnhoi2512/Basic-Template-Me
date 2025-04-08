import { ErrorType } from "./Error.type";

export type ResponseType<T> = {
  status: boolean;
  message: string;
  data?: T | T[];
  error?: string | ErrorType;
  token?: string;
};
