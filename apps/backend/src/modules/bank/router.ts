import { initServer } from '@ts-rest/express';
import { bankContract } from '../../contract/bank/contract';
import { bankQueryHandlers } from './query';
import { bankMutationHandlers } from './mutation';

const s = initServer();

export const bankRouter = s.router(bankContract, {
  sendBankRegistrationOtp: bankMutationHandlers.sendBankRegistrationOtp,
  getBankDetailsByUserId: bankQueryHandlers.getBankDetailsByUserId,
  getBankDetailsByAccountNumber:
    bankQueryHandlers.getBankDetailsByAccountNumber,
  getBankBalance: bankQueryHandlers.getBankBalance,
  createBankDetails: bankMutationHandlers.createBankDetails,
  sendMoney: bankMutationHandlers.sendMoney,
  validateTransactionPIN: bankMutationHandlers.validateTransactionPIN,
  validateBankRegistrationOtp: bankMutationHandlers.validateBankRegistrationOtp,
  uploadBankProfilePicture: bankMutationHandlers.uploadBankProfilePicture,
  createBankTransactionPin: bankMutationHandlers.createBankTransactionPin,
  paymentIntent: bankMutationHandlers.createPaymentIntent,
});
