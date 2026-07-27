import { Request, Response, NextFunction } from 'express';

import { userService } from './user.service';

import { successResponse } from '@common/utils/response';

export class UserController {

  static async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {

      const result =
        await userService.register(
          req.body,
        );

      return successResponse(
        res,
        'User registered successfully.',
        result,
        201,
      );

    } catch (error) {
      next(error);
    }
  }
}