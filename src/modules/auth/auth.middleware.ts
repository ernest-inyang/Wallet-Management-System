import { Request, Response, NextFunction } from 'express';

import { verifyToken } from '@common/utils/jwt';
import { UnauthorizedError } from '@common/errors';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}

export class AuthMiddleware {
  static authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const header = req.headers.authorization;

    if (!header) {
      return next(
        new UnauthorizedError(
          'Authorization header missing.',
        ),
      );
    }

    const token = header.replace('Bearer ', '');

    try {
      req.user = verifyToken(token);

      next();
    } catch {
      next(
        new UnauthorizedError(
          'Invalid authentication token.',
        ),
      );
    }
  }
}