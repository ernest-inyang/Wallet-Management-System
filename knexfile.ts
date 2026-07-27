import type { Knex } from 'knex';
import { databaseConfig } from './src/config/database';

const config: Knex.Config = {
  ...databaseConfig,
};

export default config;