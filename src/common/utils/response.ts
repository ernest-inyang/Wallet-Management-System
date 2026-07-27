import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export function successResponse<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(response);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 500,
) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}