import { Knex } from 'knex';

export interface CreateTransactionDto {
  uuid: string;
  reference: string;
  wallet_id: number;
  user_id: number;
  related_user_id?: number | null;
  type: string;
  direction: string;
  status: string;
  amount: string;
  balance_before: string;
  balance_after: string;
  description?: string;
  metadata?: unknown;
}

export type TransactionScope = Knex | Knex.Transaction;