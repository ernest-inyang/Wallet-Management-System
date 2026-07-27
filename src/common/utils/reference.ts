import crypto from 'crypto';

export function generateTransactionReference() {
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();

  return `TXN-${Date.now()}-${random}`;
}