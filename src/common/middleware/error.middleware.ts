import { NextFunction, Request, Response } from 'express';
import { AppError } from '@common/errors';
import { logger } from '@config/logger';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error({
    err,
    method: req.method,
    path: req.originalUrl,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}