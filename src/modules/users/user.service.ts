import { db } from '@config/knex';

import { userRepository } from './user.repository';
import { walletRepository } from '../wallets/wallet.repository';

import { adjutorService } from '../adjutor/adjutor.service';

import { hashPassword } from '@common/utils/password';
import { signToken } from '@common/utils/jwt';

import { generateUuid } from '@common/utils/uuid';

import {
  ConflictError,
  BadRequestError,
} from '@common/errors';

export class UserService {

  async register(payload: {first_name: string; last_name: string; email: string; phone_number: string; password: string;}) {

    const emailExists =
      await userRepository.existsByEmail(payload.email,);

    if (emailExists) {
      throw new ConflictError('Email already exists.',);
    }

    const phoneExists =
      await userRepository.existsByPhone(payload.phone_number,);

    if (phoneExists) {
      throw new ConflictError('Phone number already exists.',);
    }

    const blacklisted = await adjutorService.isBlacklisted(payload.phone_number,);

    if (blacklisted) {
      throw new BadRequestError('User is blacklisted on Karma.',);
    }

    const passwordHash = await hashPassword(payload.password,);

    return db.transaction(async (trx) => {

      const user =
        await userRepository.create(
          {
            uuid: generateUuid(),
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            phone_number: payload.phone_number,
            password_hash: passwordHash,
          },
          trx,
        );

      await walletRepository.create(
        {
          uuid: generateUuid(),
          user_id: user.id,
          balance: 0,
          currency: 'NGN',
        },
        trx,
      );

      const token = signToken({
        userId: user.id,
        email: user.email,
      });

      return {
        token,
        user,
      };
    });
  }
}

export const userService =
  new UserService();