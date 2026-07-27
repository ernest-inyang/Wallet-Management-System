import { z } from 'zod';

export const fundWalletSchema = z.object({
  amount: z.coerce.number().positive(),
});

export const withdrawSchema = z.object({
  amount: z.coerce.number().positive(),
});

export const transferSchema = z.object({
  recipient_user_id: z.coerce.number().int().positive(),
  amount: z.coerce.number().positive(),
});