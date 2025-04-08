import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.config';
import { AppError } from '../types/AppError.type';

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    logger.error(`${err.status} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production mode
    if (err.isOperational) {
      logger.error(`${err.status} - ${err.message}`);
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or unknown errors
      logger.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
};