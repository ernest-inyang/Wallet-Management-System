import { userService } from '../../../src/modules/users/user.service';

import { userRepository } from '../../../src/modules/users/user.repository';
import { walletRepository } from '../../../src/modules/wallets/wallet.repository';
import { adjutorService } from '../../../src/modules/adjutor/adjutor.service';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../../../src/common/errors';

import { generateUuid } from '../../../src/common/utils/uuid';

import * as passwordUtils from '../../../src/common/utils/password';
import * as tokenUtils from '../../../src/common/utils/jwt';

jest.mock('../../../src/modules/users/user.repository');
jest.mock('../../../src/modules/wallets/wallet.repository');
jest.mock('../../../src/modules/adjutor/adjutor.service');



describe('UserService.register', () => {

    beforeEach(() => { jest.clearAllMocks(); });


    it('should register a new user successfully', async () => {
        (userRepository.existsByEmail as jest.Mock).mockResolvedValue(false);
        (userRepository.existsByPhone as jest.Mock).mockResolvedValue(false);
        (adjutorService.validateKarmaBlacklist as jest.Mock).mockResolvedValue(false);
        jest.spyOn(passwordUtils, 'hashPassword').mockResolvedValue('hashed-password');
        (userRepository.create as jest.Mock).mockResolvedValue({ id: 1, email: 'john@test.com' });
        (walletRepository.create as jest.Mock).mockResolvedValue({});

        const result = await userService.register({
            uuid: generateUuid(),
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@test.com',
            phone_number: '08012345678',
            password: 'Password123!',
        });

        expect(userRepository.create).toHaveBeenCalled();
        expect(walletRepository.create).toHaveBeenCalled();
    });


    it('should throw when email already exists', async () => {
        (userRepository.existsByEmail as jest.Mock).mockResolvedValue(true);
        await expect(
            userService.register({
                uuid: generateUuid(),
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@test.com',
                phone_number: '08012345678',
                password: 'Password123!',
            }),
        ).rejects.toThrow('Email already exists.');

    });



    it('should reject blacklisted users', async () => {
        (userRepository.existsByEmail as jest.Mock).mockResolvedValue(false);
        (userRepository.existsByPhone as jest.Mock).mockResolvedValue(false);
        (adjutorService.validateKarmaBlacklist as jest.Mock).mockRejectedValue(new BadRequestError('User is blacklisted on Karma.'));

        await expect(
            userService.register({
                uuid: generateUuid(),
                first_name: 'John',
                last_name: 'Doe',
                email: '0zspgifzbo.ga',
                phone_number: '08012345678',
                password: 'Password123!',

            }),
        ).rejects.toThrow('User is blacklisted on Karma.');
    });


    it('should throw when phone number already exists', async () => {
        (userRepository.existsByEmail as jest.Mock).mockResolvedValue(false);
        (userRepository.existsByPhone as jest.Mock).mockResolvedValue(true);
    
        await expect(
            userService.register({
                uuid: generateUuid(),
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@test.com',
                phone_number: '08012345678',
                password: 'Password123!',
            }),
        ).rejects.toThrow('Phone number already exists.');
    });


    it('should hash password before saving user', async () => {
        (userRepository.existsByEmail as jest.Mock).mockResolvedValue(false);
        (userRepository.existsByPhone as jest.Mock).mockResolvedValue(false);
        (adjutorService.validateKarmaBlacklist as jest.Mock).mockResolvedValue(undefined);
    
        const hashSpy = jest.spyOn(passwordUtils, 'hashPassword').mockResolvedValue('hashed-password');
        (userRepository.create as jest.Mock).mockResolvedValue({id: 1, email: 'john@test.com'});
        (walletRepository.create as jest.Mock).mockResolvedValue({});
    
        await userService.register({
            uuid: generateUuid(),
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@test.com',
            phone_number: '08012345678',
            password: 'Password123!',
        });
    
        expect(hashSpy).toHaveBeenCalledWith('Password123!');
    });


    it('should create wallet after user registration', async () => {
        (userRepository.existsByEmail as jest.Mock).mockResolvedValue(false);
        (userRepository.existsByPhone as jest.Mock).mockResolvedValue(false);
        (adjutorService.validateKarmaBlacklist as jest.Mock).mockResolvedValue(undefined);
    
        jest.spyOn(passwordUtils, 'hashPassword').mockResolvedValue('hashed-password');
        (userRepository.create as jest.Mock).mockResolvedValue({id: 1, email: 'john@test.com'});
        (walletRepository.create as jest.Mock).mockResolvedValue({});

        await userService.register({
            uuid: generateUuid(),
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@test.com',
            phone_number: '08012345678',
            password: 'Password123!',
        });
    
        expect(walletRepository.create).toHaveBeenCalledWith(expect.objectContaining({user_id: 1, balance: 0, currency: 'NGN'}), expect.anything());
    });


    it('should throw when phone number already exists', async () => {
        jest.spyOn(userRepository, 'existsByEmail').mockResolvedValue(false);
        jest.spyOn(userRepository, 'existsByPhone').mockResolvedValue(true);
        await expect(
            userService.register({
                uuid: generateUuid(),
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@test.com',
                phone_number: '08012345678',
                password: 'Password123!',
            }),
        ).rejects.toThrow('Phone number already exists.');
    
    });

});

