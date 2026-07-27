import { Router } from 'express';

import { TransactionController } from './transaction.controller';

import { AuthMiddleware } from '../auth/auth.middleware';

import { validate } from '@common/middleware/validator.middleware';

import {
    fundWalletSchema,
    transferSchema,
    withdrawSchema,
} from './transaction.validator';

const router = Router();

router.post(
    '/fund',
    AuthMiddleware.authenticate,
    validate(fundWalletSchema),
    TransactionController.fund,
);

router.post(
    '/withdraw',
    AuthMiddleware.authenticate,
    validate(withdrawSchema),
    TransactionController.withdraw,
);

router.post(
    '/transfer',
    AuthMiddleware.authenticate,
    validate(transferSchema),
    TransactionController.transfer,
);

router.get(
    '/',
    AuthMiddleware.authenticate,
    TransactionController.history,
);

export default router;