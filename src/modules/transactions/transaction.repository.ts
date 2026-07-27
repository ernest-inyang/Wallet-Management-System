import { Knex } from 'knex';
import { BaseRepository } from '@common/database/BaseRepository';
import { CreateTransactionDto } from './transaction.types';

export class TransactionRepository extends BaseRepository {
    async create(
        payload: CreateTransactionDto,
        trx?: Knex.Transaction,
    ) {
        const query = trx ?? this.db;

        const [id] = await query('transactions').insert(payload);

        return query('transactions')
            .where({ id })
            .first();
    }

    async findByReference(reference: string) {
        return this.db('transactions')
            .where({ reference })
            .orderBy('created_at', 'asc');
    }

    async findByWallet(walletId: number) {
        return this.db('transactions')
            .where({ wallet_id: walletId })
            .orderBy('created_at', 'desc');
    }

    async getByWallet(walletId: number, page = 1, limit = 10) {

        return this.db('transactions')
            .where({
                wallet_id: walletId,
            })
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset((page - 1) * limit);
    }


    async countByWallet(walletId: number) {

        const result = await this.db('transactions')
            .where({
                wallet_id: walletId,
            })
            .count('* as total')
            .first();

        return Number(result?.total ?? 0);

    }



}

export const transactionRepository =
  new TransactionRepository();