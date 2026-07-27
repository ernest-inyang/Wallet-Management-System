import { Router } from 'express';


import userRoutes from '@modules/users/user.routes';
import walletRoutes from '@modules/wallets/wallet.routes';
import transactionRoutes from '@modules/transactions/transaction.routes';

const router = Router();

router.get('/health', (_, res) => {
    res.status(200).json({
      success: true,
      message: 'Wallet API is running.',
      timestamp: new Date().toISOString(),
    });
});;

router.use('/users', userRoutes);
router.use('/wallet', walletRoutes);
router.use('/transactions', transactionRoutes);




export default router;