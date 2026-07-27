import { db } from '@config/knex';

import { userRepository } from './user.repository';
import { walletRepository } from '../wallets/wallet.repository';

import { adjutorService } from '../adjutor/adjutor.service';

import { hashPassword } from '@common/utils/password';
import { signToken } from '@common/utils/jwt';

import { generateUuid } from '@common/utils/uuid';
import { NotFoundError, UnauthorizedError } from '@common/errors';
import { comparePassword } from '@common/utils/password';
import { loginSchema } from './user.validator';
import { toUserResponse } from './user.mapper';
import { CreateUserDto, LoginDto, RegisterUserDto } from './user.types';

import {
  ConflictError,
} from '@common/errors';

export class UserService {

  async register(payload: RegisterUserDto) {

    const emailExists = await userRepository.existsByEmail(payload.email,);
    if (emailExists) {
      throw new ConflictError('Email already exists.',);
    }

    const phoneExists = await userRepository.existsByPhone(payload.phone_number,);
    if (phoneExists) {
      throw new ConflictError('Phone number already exists.',);
    }

    await adjutorService.validateKarmaBlacklist(payload.email);
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
      await walletRepository.create({uuid: generateUuid(), user_id: user.id, balance: 0, currency: 'NGN',}, trx,);
      return { user: toUserResponse(user)};
    });
  }

  async login(payload: LoginDto){
    const user = await userRepository.findByEmail(payload.email);
    if(!user){
        throw new UnauthorizedError('Invalid credentials.',);
    }

    const valid = await comparePassword(payload.password, user.password_hash);
    if(!valid){
        throw new UnauthorizedError('Invalid credentials.');
    }

    const token = signToken({userId:user.id, email:user.email});
    return{token, user: toUserResponse(user),};
}

async getProfile(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found.');
    }
    return {user: toUserResponse(user)};
}



}

export const userService =
  new UserService();