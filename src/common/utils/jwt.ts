import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '@config/env';

export interface JwtPayload {userId: number; email: string;}

export function signToken(payload: JwtPayload): string {
  const secret: Secret = env.JWT_SECRET;

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET as Secret,) as JwtPayload;
}