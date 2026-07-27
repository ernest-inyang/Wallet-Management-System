import { Knex } from 'knex';
import { BaseRepository } from '@common/database/BaseRepository';
import { CreateWalletDto, Wallet } from './wallet.types';

export class WalletRepository extends BaseRepository {
  async create(
    payload: CreateWalletDto,
    trx?: Knex.Transaction,
  ): Promise<Wallet> {
    const query = trx ?? this.db;

    const [id] = await query('wallets').insert(payload);

    return (await query<Wallet>('wallets')
      .where({ id })
      .first())!;
  }

  async findById(id: number): Promise<Wallet | undefined> {
    return this.db<Wallet>('wallets')
      .where({ id })
      .first();
  }

  async findByUserId(userId: number): Promise<Wallet | undefined> {
    return this.db<Wallet>('wallets')
      .where({ user_id: userId })
      .first();
  }

  async lockWallet(
    walletId: number,
    trx: Knex.Transaction,
  ): Promise<Wallet | undefined> {
    return trx<Wallet>('wallets')
      .where({ id: walletId })
      .forUpdate()
      .first();
  }

  async updateBalance(
    walletId: number,
    balance: string,
    trx: Knex.Transaction,
  ): Promise<void> {
    await trx('wallets')
      .where({ id: walletId })
      .update({
        balance,
        updated_at: new Date(),
      });
  }

    async findByUserIdForUpdate(userId: number, trx: Knex.Transaction,) {
        return trx<Wallet>('wallets')
            .where({
                user_id: userId,
            })
            .forUpdate()
            .first();
    }

    async getBalance(userId: number,) {
    
        return this.db('wallets')
            .where({
                user_id: userId,
            })
            .first();
    
    }

}

export const walletRepository = new WalletRepository();