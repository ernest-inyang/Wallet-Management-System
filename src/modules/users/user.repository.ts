import { BaseRepository } from '@common/database/BaseRepository';
import { CreateUserDto, TransactionScope, User } from './user.types';

export class UserRepository extends BaseRepository {
    async create(
        payload: CreateUserDto,
        trx?: TransactionScope,
    ): Promise<User> {

        const query = trx ?? this.db;

        const [id] = await query('users').insert(payload);

        const user = await query<User>('users')
            .where({ id })
            .first();

        return user!;
    }

  async findById(id: number): Promise<User | undefined> {
    return this.db<User>('users')
      .where({ id })
      .first();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.db<User>('users')
      .where({ email })
      .first();
  }

  async findByPhoneNumber(phone_number: string): Promise<User | undefined> {
    return this.db<User>('users')
      .where({ phone_number })
      .first();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);

    return !!user;
  }

  async existsByPhone(phone_number: string): Promise<boolean> {
    const user = await this.findByPhoneNumber(phone_number);

    return !!user;
  }
}

export const userRepository = new UserRepository();