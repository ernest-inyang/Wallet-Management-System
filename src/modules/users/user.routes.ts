import { Router } from 'express';

import { UserController } from './user.controller';

import { validate } from '@common/middleware/validator.middleware';

import { registerSchema } from './user.validator';

const router = Router();

router.post(
  '/register',
  validate(registerSchema),
  UserController.register,
);

export default router;