import { Request, Response, NextFunction } from 'express';

import { transactionService } from './transaction.service';
import { successResponse } from '@common/utils/response';

export class TransactionController {

    static async fund(req: Request, res: Response, next: NextFunction,) {
        try {
            const result = await transactionService.fund(req.user!.userId, req.body.amount);
            return successResponse(res, 'Wallet funded successfully.', result,);
        } catch (error) {
            next(error);
        }
    }

    static async withdraw(req: Request, res: Response, next: NextFunction,) {
        try {
            const result = await transactionService.withdraw(req.user!.userId, req.body.amount);
            return successResponse(res, 'Withdrawal successful.', result);
        } catch (error) {
            next(error);
        }
    }

    static async transfer(req: Request, res: Response, next: NextFunction) {

        try {
            const result = await transactionService.transfer(req.user!.userId, req.body.recipient_user_id, req.body.amount,);
            return successResponse(res, 'Transfer successful.', result,);
        } catch (error) {
            next(error);
        }
    }

    static async history(req: Request, res: Response, next: NextFunction) {

        try {
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 10);
            const result = await transactionService.history(req.user!.userId, page, limit);
            return successResponse(res, 'Transactions retrieved successfully.', result,);

        } catch (error) {
            next(error);
        }
    }

}