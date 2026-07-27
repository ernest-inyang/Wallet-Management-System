export const TransactionType = {
    FUND: 'FUND',
    TRANSFER: 'TRANSFER',
    WITHDRAW: 'WITHDRAW',
  } as const;
  
  export type TransactionType =
    (typeof TransactionType)[keyof typeof TransactionType];