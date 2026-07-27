import { db } from '@config/knex';

import { walletRepository } from '../wallets/wallet.repository';
import { walletLedgerService } from '../wallets/wallet-ledger.service';
import { transactionRepository } from '../transactions/transaction.repository';
import { TransactionType } from '@common/constants/transaction-type';


import {
    BadRequestError,
    NotFoundError,
} from '@common/errors';

export class TransactionService {

    async fund(userId: number, amount: number,) {

        return db.transaction(async trx => {

            const wallet = await walletRepository.findByUserIdForUpdate(userId, trx,);
            if (!wallet) {
                throw new NotFoundError('Wallet not found.',);
            }

            const newBalance = await walletLedgerService.credit(
                trx,
                {
                    walletId: wallet.id,
                    userId,
                    amount: amount.toFixed(2),
                    type: TransactionType.FUND,
                    description: 'Wallet funding',
                },
            );

            return {balance: newBalance};

        });

    }

    async withdraw(userId: number, amount: number,) {

        return db.transaction(async trx => {
            const wallet =
                await walletRepository.findByUserIdForUpdate(userId, trx,);

            if (!wallet) {
                throw new NotFoundError('Wallet not found.',);
            }

            const balance = await walletLedgerService.debit(
                trx,
                {
                    walletId: wallet.id,
                    userId,
                    amount: amount.toFixed(2),
                    type: TransactionType.WITHDRAW,
                    description: 'Wallet withdrawal',
                },
            );
            return { balance, };
        });

    }

    async transfer(senderId: number, recipientId: number, amount: number,) {

        if (senderId === recipientId) {
            throw new BadRequestError('Cannot transfer to yourself.');
        }

        return db.transaction(async trx => {

            const senderWallet = await walletRepository.findByUserIdForUpdate(senderId, trx);
            if (!senderWallet) {
                throw new NotFoundError('Sender wallet not found.');
            }

            
            const receiverWallet = await walletRepository.findByUserIdForUpdate(recipientId, trx);
            if (!receiverWallet) {
                throw new NotFoundError('Recipient wallet not found.');
            }

            const reference = `TRF-${Date.now()}`;

            await walletLedgerService.debit(trx,
                {
                    walletId: senderWallet.id,
                    userId: senderId,
                    relatedUserId: recipientId,
                    amount: amount.toFixed(2),
                    type: TransactionType.TRANSFER,
                    description: 'Wallet transfer',
                    reference,
                },
            );

            await walletLedgerService.credit(
                trx,
                {
                    walletId: receiverWallet.id,
                    userId: recipientId,
                    relatedUserId: senderId,
                    amount: amount.toFixed(2),
                    type: TransactionType.TRANSFER,
                    description: 'Wallet transfer',
                    reference,
                },
            );
            return {reference};

        });

    }

    async history(userId: number, page = 1, limit = 10,) {

        const wallet = await walletRepository.findByUserId(userId);
        if (!wallet) {
            throw new NotFoundError('Wallet not found.',);
        }

        const transactions = await transactionRepository.getByWallet(wallet.id, page, limit,);
        const total = await transactionRepository.countByWallet(wallet.id,);
        return { total, page, limit, data: transactions, };
    }




}

export const transactionService =
    new TransactionService();