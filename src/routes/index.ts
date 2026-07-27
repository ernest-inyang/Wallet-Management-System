import { Router } from 'express';


import userRoutes from '@modules/users/user.routes';
import walletRoutes from '@modules/wallets/wallet.routes';
import transactionRoutes from '@modules/transactions/transaction.routes';

const router = Router();

router.get('/health', (req, res,) => {
    res.json({ success: true, status: 'UP', timestamp: new Date(), });
});

router.use('/users', userRoutes);
router.use('/wallet', walletRoutes);
router.use('/transactions', transactionRoutes);




export default router;