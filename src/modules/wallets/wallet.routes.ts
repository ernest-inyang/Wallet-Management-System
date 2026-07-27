import { Router } from 'express';

import { WalletController } from './wallet.controller';
import { AuthMiddleware } from '../auth/auth.middleware';

const router = Router();

router.get(
  '/balance',
  AuthMiddleware.authenticate,
  WalletController.getBalance,
);

export default router;