import { Response } from 'express';

export function successResponse(
  res: Response,
  message: string,
  data?: unknown,
) {
  return res.json({
    success: true,
    message,
    data,
  });
}