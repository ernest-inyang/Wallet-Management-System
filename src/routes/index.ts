import { Router } from 'express';

export const router = Router();

router.get('/health', (_, res) => {
  res.json({success: true, message: 'OK',});
});