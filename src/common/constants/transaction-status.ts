export const TransactionStatus = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    REVERSED: 'REVERSED',
  } as const;
  
  export type TransactionStatus =
    (typeof TransactionStatus)[keyof typeof TransactionStatus];