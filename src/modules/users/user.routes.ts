import { Router } from 'express';

import { UserController } from './user.controller';

import { validate } from '@common/middleware/validator.middleware';

import { loginSchema, registerSchema } from './user.validator';
import { AuthMiddleware } from '@modules/auth/auth.middleware';

const router = Router();




router.post('/register',
  validate(registerSchema),
  UserController.register,
);

router.post('/login',
    validate(loginSchema),
    UserController.login,
);

router.get('/',
    AuthMiddleware.authenticate,
    UserController.getProfile,
);

export default router;