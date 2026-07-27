import { Knex } from 'knex';
import { db } from '@config/knex';

export async function withTransaction<T>(
  callback: (trx: Knex.Transaction) => Promise<T>,
): Promise<T> {
  return db.transaction(async (trx) => callback(trx));
}