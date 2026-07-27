export const WalletStatus = {

    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',

} as const;

export type WalletStatus =
(typeof WalletStatus)[keyof typeof WalletStatus];