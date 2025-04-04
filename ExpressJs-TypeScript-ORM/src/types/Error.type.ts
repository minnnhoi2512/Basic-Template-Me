export class ErrorType extends Error {
  statusCode?: number;
  [key: string]: any;

  constructor(
    name: string,
    message: string,
    code : number,
    statusCode?: number,
    additionalProperties?: { [key: string]: any }
  ) {
    super(message);
    this.name = name; 
    this.code = code; 
    this.statusCode = statusCode;
    if (additionalProperties) {
      Object.assign(this, additionalProperties);
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
