import { transactionService } from '../../../src/modules/transactions/transaction.service';
import { db } from '../../../src/config/knex';

import { walletRepository } from '../../../src/modules/wallets/wallet.repository';
import { transactionRepository } from '../../../src/modules/transactions/transaction.repository';
import { walletLedgerService } from '../../../src/modules/wallets/wallet-ledger.service';


jest.mock('../../../src/config/knex', () => ({db: {transaction: jest.fn(),},}));
jest.mock('../../../src/modules/wallets/wallet.repository');
jest.mock('../../../src/modules/transactions/transaction.repository');
jest.mock('../../../src/modules/wallets/wallet-ledger.service');


beforeEach(() => { 
    jest.clearAllMocks();
    (db.transaction as jest.Mock) = jest.fn(async (callback) => { return callback({}); });
});


it('should fund wallet successfully', async () => {
    (walletRepository.findByUserIdForUpdate as jest.Mock).mockResolvedValue({id: 1, balance: '1000.00'});
    (walletLedgerService.credit as jest.Mock).mockResolvedValue('6000.00');

    const result = await transactionService.fund( 1, 5000);

    expect(walletLedgerService.credit).toHaveBeenCalled();
    expect(result.balance).toBe('6000.00');
});


it('should throw if wallet does not exist', async () => {
    (walletRepository.findByUserIdForUpdate as jest.Mock).mockResolvedValue(null);
    await expect(transactionService.fund(1, 5000)).rejects.toThrow('Wallet not found.');
});


it('should call wallet ledger credit correctly', async () => {
    (walletRepository.findByUserIdForUpdate as jest.Mock).mockResolvedValue({id: 10, balance: '2000'});
    (walletLedgerService.credit as jest.Mock).mockResolvedValue('7000');

    await transactionService.fund( 1, 5000,);
    expect(walletLedgerService.credit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({walletId: 10, amount: '5000.00', userId: 1}));
});



it('should withdraw successfully', async () => {
    (walletRepository.findByUserIdForUpdate as jest.Mock).mockResolvedValue({id: 1,balance: '8000.00'});
    (walletLedgerService.debit as jest.Mock).mockResolvedValue('3000.00');

    const result = await transactionService.withdraw(1, 5000);
    expect(result.balance).toBe('3000.00');
});


it('should throw for insufficient balance', async () => {
    (walletRepository.findByUserIdForUpdate as jest.Mock).mockResolvedValue({id: 1, balance: '1000.00', });
    (walletLedgerService.debit as jest.Mock).mockRejectedValue( new Error('Insufficient wallet balance.'));

    await expect(transactionService.withdraw(1,5000)).rejects.toThrow('Insufficient wallet balance.');
});



it('should transfer funds successfully', async () => {
    (walletRepository.findByUserIdForUpdate as jest.Mock).mockResolvedValueOnce({id: 1,user_id: 1, balance: '10000'}).mockResolvedValueOnce({id: 2,user_id: 2, balance: '1000'});
    (walletLedgerService.debit as jest.Mock).mockResolvedValue('5000');
    (walletLedgerService.credit as jest.Mock).mockResolvedValue('6000');

    const result =await transactionService.transfer(1, 2, 5000);
    expect(result).toEqual({reference: expect.any(String)});
});


it('should throw when sender wallet does not exist', async () => {
    (walletRepository.findByUserIdForUpdate as jest.Mock).mockResolvedValue(null);
    await expect(transactionService.transfer(1,2, 5000,)).rejects.toThrow('Sender wallet not found.');
});


it('should throw when recipient wallet does not exist', async () => {
    (walletRepository.findByUserIdForUpdate as jest.Mock).mockResolvedValueOnce({id: 1, balance: '10000'}).mockResolvedValueOnce(null);
    await expect(transactionService.transfer(1, 2, 5000)).rejects.toThrow('Recipient wallet not found.');
});



it('should reject self transfer', async () => {
    await expect(transactionService.transfer(1, 1, 5000)).rejects.toThrow('Cannot transfer to yourself.');
});


it('should debit before credit', async () => {
    (walletRepository.findByUserIdForUpdate as jest.Mock).mockResolvedValueOnce({id: 1, balance: '10000'}).mockResolvedValueOnce({id: 2, balance: '1000'});
    const order: string[] = [];
    (walletLedgerService.debit as jest.Mock).mockImplementation(() => {order.push('debit');});
    (walletLedgerService.credit as jest.Mock).mockImplementation(() => {order.push('credit'); });

    await transactionService.transfer(1,2,5000,);
    expect(order).toEqual(['debit', 'credit']);
});


it('should return transaction history', async () => {
    (transactionRepository.getByWallet as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (transactionRepository.countByWallet as jest.Mock).mockResolvedValue(1);
    (walletRepository.findByUserId as jest.Mock).mockResolvedValue({id: 10});

    const result = await transactionService.history(1);
    expect(result).toEqual({total: 1, page: 1, limit: 10, data: [{ id: 1 }],});
});


it('should throw when fetching history for non-existing wallet', async () => {
    (walletRepository.findByUserId as jest.Mock).mockResolvedValue(undefined);
    await expect(transactionService.history(1)).rejects.toThrow('Wallet not found.');

});