import { Knex } from 'knex';

export interface Wallet {
  id: number;
  uuid: string;
  user_id: number;
  balance: string;
  currency: string;
  is_active: boolean;
}

export interface CreateWalletDto {
  uuid: string;
  user_id: number;
  balance?: number;
  currency?: string;
}

export type TransactionScope = Knex | Knex.Transaction;