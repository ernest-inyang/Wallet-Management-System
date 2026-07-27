import bcrypt from 'bcrypt';

// this can be in the env
const SALT_ROUNDS = 12;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string,
) {
  return bcrypt.compare(password, hash);
}