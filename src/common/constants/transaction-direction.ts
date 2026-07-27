export const TransactionDirection = {
    CREDIT: 'CREDIT',
    DEBIT: 'DEBIT',
  } as const;
  
  export type TransactionDirection =
    (typeof TransactionDirection)[keyof typeof TransactionDirection];