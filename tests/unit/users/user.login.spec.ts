import { userService } from '../../../src/modules/users/user.service';
import { userRepository } from '../../../src/modules/users/user.repository';
import * as passwordUtils from '../../../src/common/utils/password';
import * as jwtUtils from '../../../src/common/utils/jwt';

jest.mock('../../../src/modules/users/user.repository');





it('should login successfully', async () => {

    (userRepository.findByEmail as jest.Mock).mockResolvedValue({ id: 1, email: 'john@test.com', password_hash: 'hashed', });
    jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(true);
    jest.spyOn(jwtUtils, 'signToken').mockReturnValue('jwt-token');

    const result = await userService.login({ email: 'john@test.com', password: 'Password123!', });
    expect(result.token).toBe('jwt-token');
});


it('should throw when email does not exist', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    await expect(userService.login({ email: 'john@test.com', password: 'Password123!', })).rejects.toThrow('Invalid credentials.');
});


it('should throw when password is invalid', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue({ password_hash: 'hashed' });
    jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(false);

    await expect(userService.login({ email: 'john@test.com', password: 'WrongPassword', })).rejects.toThrow('Invalid credentials.');
});



it('should compare password hash', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue({ password_hash: 'hashed' });

    const compareSpy = jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(true);
    jest.spyOn(jwtUtils, 'signToken').mockReturnValue('jwt-token');
    await userService.login({ email: 'john@test.com', password: 'Password123!', });
    expect(compareSpy).toHaveBeenCalledWith('Password123!', 'hashed');
});



it('should generate JWT token', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue({ id: 1, email: 'john@test.com', password_hash: 'hashed', });
    jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(true);
    const tokenSpy = jest.spyOn(jwtUtils, 'signToken').mockReturnValue('jwt-token');
    await userService.login({ email: 'john@test.com', password: 'Password123!' });
    expect(tokenSpy).toHaveBeenCalledWith({ userId: 1, email: 'john@test.com' });
});
