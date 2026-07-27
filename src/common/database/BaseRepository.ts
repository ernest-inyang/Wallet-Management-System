import { Knex } from 'knex';
import { db } from '@config/knex';

export abstract class BaseRepository {
  protected readonly db: Knex = db;
}