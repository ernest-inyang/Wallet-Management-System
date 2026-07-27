import { Knex } from 'knex';
import { env } from './env';

export const databaseConfig: Knex.Config = {
  client: 'mysql2',

  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },

  pool: {
    min: 2,
    max: 10,
  },

  migrations: {
    directory: './database/migrations',
    extension: 'ts',
  },

  seeds: {
    directory: './database/seeds',
    extension: 'ts',
  },
};