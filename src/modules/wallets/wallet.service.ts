import { walletRepository } from './wallet.repository';
import { NotFoundError } from '@common/errors';

export class WalletService {
  async getBalance(userId: number) {
    const wallet = await walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new NotFoundError('Wallet not found.');
    }

    return {
      balance: wallet.balance,
      currency: wallet.currency,
    };
  }
}

export const walletService = new WalletService();