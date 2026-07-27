import { Request, Response, NextFunction } from 'express';
import { AppError } from '@common/errors/AppError';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  req.log.error(error);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}