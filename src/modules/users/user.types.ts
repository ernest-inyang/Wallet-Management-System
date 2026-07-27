import { Knex } from 'knex';

export interface CreateUserDto {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password_hash: string;
}

export interface User {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password_hash: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type TransactionScope = Knex | Knex.Transaction;