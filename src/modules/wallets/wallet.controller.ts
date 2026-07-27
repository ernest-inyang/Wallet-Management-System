import { NextFunction, Request, Response } from 'express';

import { walletService } from './wallet.service';
import { successResponse } from '@common/utils/response';

export class WalletController {

  static async getBalance(req: Request, res: Response, next: NextFunction,) {
    try {
      const result = await walletService.getBalance(
        req.user!.userId,
      );

      return successResponse(
        res,
        'Wallet retrieved successfully.',
        result,
      );
    } catch (error) {
      next(error);
    }
  }
}