import { walletLedgerService } from '../../../src/modules/wallets/wallet-ledger.service';
import { walletRepository } from '../../../src/modules/wallets/wallet.repository';
import { transactionRepository } from '../../../src/modules/transactions/transaction.repository';
import * as uuidUtils from '../../../src/common/utils/uuid';
import * as referenceUtils from '../../../src/common/utils/reference';

import { Money } from '../../../src/common/utils/money';
import { generateUuid } from '../../../src/common/utils/uuid';
import { generateTransactionReference } from '../../../src/common/utils/reference';

jest.mock('../../../src/modules/wallets/wallet.repository');
jest.mock('../../../src/modules/transactions/transaction.repository');
jest.mock('../../../src/common/utils/uuid', () => ({generateUuid: jest.fn(() => 'uuid-123')}));
jest.mock('../../../src/common/utils/reference', () => ({generateTransactionReference: jest.fn(() => 'TXN-123'),}));

describe('WalletLedgerService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(uuidUtils, 'generateUuid')
            .mockReturnValue('uuid-123');

        jest.spyOn(referenceUtils, 'generateTransactionReference')
            .mockReturnValue('TXN-123');
    });



    it('should credit wallet successfully', async () => {

        (walletRepository.lockWallet as jest.Mock).mockResolvedValue({ id: 1, balance: '1000.00', });
        (walletRepository.updateBalance as jest.Mock).mockResolvedValue(undefined);
        (transactionRepository.create as jest.Mock).mockResolvedValue({});

        const result = await walletLedgerService.credit({} as any,
            {
                walletId: 1,
                userId: 1,
                amount: '500.00',
                type: 'FUND',
                description: 'Wallet funding',
            },
        );

        expect(result).toBe('1500.00');
    });


    it('should throw when wallet is not found during credit', async () => {
        (walletRepository.lockWallet as jest.Mock).mockResolvedValue(undefined);
        await expect(walletLedgerService.credit({} as any,
            {
                walletId: 1,
                userId: 1,
                amount: '500.00',
                type: 'FUND',
                description: 'Wallet funding',
            },
        ),
        ).rejects.toThrow('Wallet not found.');
    });



    it('should update wallet balance after credit', async () => {
        (walletRepository.lockWallet as jest.Mock).mockResolvedValue({ id: 1, balance: '1000.00' });
        (walletRepository.updateBalance as jest.Mock).mockResolvedValue(undefined);
        (transactionRepository.create as jest.Mock).mockResolvedValue({});

        await walletLedgerService.credit({} as any,
            {
                walletId: 1,
                userId: 1,
                amount: '500.00',
                type: 'FUND',
                description: 'Wallet funding',
            },
        );
        expect(walletRepository.updateBalance).toHaveBeenCalledWith(1, '1500.00', expect.anything(),);
    });


    it('should create a credit transaction', async () => {
        (walletRepository.lockWallet as jest.Mock).mockResolvedValue({ id: 1, balance: '1000.00' });
        (walletRepository.updateBalance as jest.Mock).mockResolvedValue(undefined);
        (transactionRepository.create as jest.Mock).mockResolvedValue({});

        await walletLedgerService.credit({} as any,
            {
                walletId: 1,
                userId: 1,
                amount: '500.00',
                type: 'FUND',
                description: 'Wallet funding',
            },
        );

        expect(transactionRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                wallet_id: 1,
                user_id: 1,
                amount: '500.00',
                balance_before: '1000.00',
                balance_after: '1500.00',
                description: 'Wallet funding',
                reference: 'TXN-123',
                uuid: 'uuid-123',
            }),
            expect.anything(),
        );
    });



    it('should use supplied reference if provided', async () => {
        (walletRepository.lockWallet as jest.Mock).mockResolvedValue({ id: 1, balance: '1000.00', });
        (walletRepository.updateBalance as jest.Mock).mockResolvedValue(undefined);
        (transactionRepository.create as jest.Mock).mockResolvedValue({});
        await walletLedgerService.credit({} as any,
            {
                walletId: 1,
                userId: 1,
                amount: '500.00',
                type: 'TRANSFER',
                description: 'Transfer',
                reference: 'CUSTOM-REF',
            },
        );
        expect(transactionRepository.create).toHaveBeenCalledWith(expect.objectContaining({ reference: 'CUSTOM-REF', }), expect.anything(),);
    });


    it('should debit wallet successfully', async () => {
        (walletRepository.lockWallet as jest.Mock).mockResolvedValue({id: 1, balance: '1000.00'});
        (walletRepository.updateBalance as jest.Mock).mockResolvedValue(undefined);
        (transactionRepository.create as jest.Mock).mockResolvedValue({});
    
        const result = await walletLedgerService.debit({} as any,
            {
                walletId: 1,
                userId: 1,
                amount: '300.00',
                type: 'WITHDRAW',
                description: 'Wallet withdrawal',
            },
        );
        expect(result).toBe('700.00');
    });


    it('should throw when wallet is not found during debit', async () => {
        (walletRepository.lockWallet as jest.Mock).mockResolvedValue(undefined);
        await expect(walletLedgerService.debit({} as any,
                {
                    walletId: 1,
                    userId: 1,
                    amount: '300.00',
                    type: 'WITHDRAW',
                    description: 'Wallet withdrawal',
                },
            ),
        ).rejects.toThrow('Wallet not found.');
    });



    it('should throw when balance is insufficient', async () => {
 (walletRepository.lockWallet as jest.Mock).mockResolvedValue({ id: 1, balance: '300.00',});
    
        await expect(walletLedgerService.debit({} as any,
                {
                    walletId: 1,
                    userId: 1,
                    amount: '500.00',
                    type: 'WITHDRAW',
                    description: 'Wallet withdrawal',
                },
            ),
        ).rejects.toThrow('Insufficient balance.');
    });


    it('should update wallet balance after debit', async () => {
        (walletRepository.lockWallet as jest.Mock).mockResolvedValue({id: 1, balance: '1000.00',});
        (walletRepository.updateBalance as jest.Mock).mockResolvedValue(undefined);
        (transactionRepository.create as jest.Mock).mockResolvedValue({});
    
        await walletLedgerService.debit({} as any,
            {
                walletId: 1,
                userId: 1,
                amount: '300.00',
                type: 'WITHDRAW',
                description: 'Wallet withdrawal',
            },
        );
        expect(walletRepository.updateBalance).toHaveBeenCalledWith(1, '700.00', expect.anything(),);
    });



    it('should create a debit transaction', async () => {
        (walletRepository.lockWallet as jest.Mock).mockResolvedValue({id: 1, balance: '1000.00'});
        (walletRepository.updateBalance as jest.Mock).mockResolvedValue(undefined);
        (transactionRepository.create as jest.Mock).mockResolvedValue({});
    
        await walletLedgerService.debit({} as any,
            {
                walletId: 1,
                userId: 1,
                amount: '300.00',
                type: 'WITHDRAW',
                description: 'Wallet withdrawal',
            },
        );
    
        expect(transactionRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                wallet_id: 1,
                user_id: 1,
                amount: '300.00',
                balance_before: '1000.00',
                balance_after: '700.00',
                description: 'Wallet withdrawal',
                reference: 'TXN-123',
                uuid: 'uuid-123',
            }),
            expect.anything(),
        );
    });


    it('should use supplied reference during debit', async () => {
        (walletRepository.lockWallet as jest.Mock).mockResolvedValue({id: 1, balance: '1000.00',});
        (walletRepository.updateBalance as jest.Mock).mockResolvedValue(undefined);
        (transactionRepository.create as jest.Mock).mockResolvedValue({});
    
        await walletLedgerService.debit({} as any,
            {
                walletId: 1,
                userId: 1,
                amount: '300.00',
                type: 'TRANSFER',
                description: 'Wallet transfer',
                reference: 'CUSTOM-REF',
            },
        );
    
        expect(transactionRepository.create).toHaveBeenCalledWith(expect.objectContaining({reference: 'CUSTOM-REF'}), expect.anything(),);
    });


    it('should generate a transaction reference when none is provided', async () => {
        (walletRepository.lockWallet as jest.Mock).mockResolvedValue({ id: 1, balance: '1000.00',});
        (walletRepository.updateBalance as jest.Mock).mockResolvedValue(undefined);
        (transactionRepository.create as jest.Mock).mockResolvedValue({});
    
        await walletLedgerService.debit({} as any,
            {
                walletId: 1,
                userId: 1,
                amount: '300.00',
                type: 'WITHDRAW',
                description: 'Wallet withdrawal',
            },
        );
        expect(generateTransactionReference).toHaveBeenCalled();
    });


    it('should generate a UUID for every debit transaction', async () => {
        (walletRepository.lockWallet as jest.Mock).mockResolvedValue({id: 1,balance: '1000.00'});
        (walletRepository.updateBalance as jest.Mock).mockResolvedValue(undefined);
        (transactionRepository.create as jest.Mock).mockResolvedValue({});
    
        await walletLedgerService.debit({} as any,
            {
                walletId: 1,
                userId: 1,
                amount: '300.00',
                type: 'WITHDRAW',
                description: 'Wallet withdrawal',
            },
        );
        expect(generateUuid).toHaveBeenCalled();
    });


    it('should not update wallet when balance is insufficient', async () => {
        (walletRepository.lockWallet as jest.Mock).mockResolvedValue({id: 1, balance: '300.00',});
    
        await expect(walletLedgerService.debit({} as any,
                {
                    walletId: 1,
                    userId: 1,
                    amount: '500.00',
                    type: 'WITHDRAW',
                    description: 'Wallet withdrawal',
                },
            ),
        ).rejects.toThrow('Insufficient balance.');
    
        expect(walletRepository.updateBalance).not.toHaveBeenCalled();
        expect(transactionRepository.create).not.toHaveBeenCalled();
    });









});
