import { Knex } from 'knex';

import { walletRepository } from './wallet.repository';
import { transactionRepository } from '../transactions/transaction.repository';
import { generateUuid } from '@common/utils/uuid';
import { generateTransactionReference } from '@common/utils/reference';
import { Money } from '@common/utils/money';
import { BadRequestError } from '@common/errors';
import { TransactionStatus } from '@common/constants/transaction-status';
import { TransactionDirection } from '@common/constants/transaction-direction';

export class WalletLedgerService {

  async credit(
    trx: Knex.Transaction,
    payload: {
      walletId: number;
      userId: number;
      amount: string;
      type: string;
      description: string;
      metadata?: unknown;
      reference?: string;
      relatedUserId?: number;
    },
  ) {

    const wallet = await walletRepository.lockWallet(payload.walletId, trx);

    if (!wallet) {
      throw new BadRequestError('Wallet not found.');
    }

    const before = wallet.balance;

    const after = Money.add(before, payload.amount);
    await walletRepository.updateBalance(wallet.id, after, trx,);
    await transactionRepository.create(
      {
        uuid: generateUuid(),
        reference:
          payload.reference ??
          generateTransactionReference(),
        wallet_id: wallet.id,
        type: payload.type,
        direction: TransactionDirection.CREDIT,
        status: TransactionStatus.SUCCESS,
        amount: payload.amount,
        balance_before: before,
        balance_after: after,
        description: payload.description,
        metadata: payload.metadata,
      },
      trx,
    );

    return after;
  }

  async debit(
    trx: Knex.Transaction,
    payload: {
      walletId: number;
      userId: number;
      amount: string;
      type: string;
      description: string;
      metadata?: unknown;
      reference?: string;
      relatedUserId?: number;
    },
  ) {

    const wallet = await walletRepository.lockWallet(payload.walletId, trx,);
    if (!wallet) {
      throw new BadRequestError('Wallet not found.');
    }

    if (!Money.greaterThanOrEqual(wallet.balance, payload.amount)) {
      throw new BadRequestError('Insufficient balance.',);
    }

    const before = wallet.balance;
    const after = Money.subtract(before, payload.amount,);
    await walletRepository.updateBalance(wallet.id, after, trx,);
    await transactionRepository.create(
      {
        uuid: generateUuid(),
        reference: payload.reference ?? generateTransactionReference(),
        wallet_id: wallet.id,
        type: payload.type,
        direction: TransactionDirection.DEBIT,
        status: TransactionStatus.SUCCESS,
        amount: payload.amount,
        balance_before: before,
        balance_after: after,
        description: payload.description,
        metadata: payload.metadata,
      },
      trx,
    );

    return after;
  }
}

export const walletLedgerService =
  new WalletLedgerService();