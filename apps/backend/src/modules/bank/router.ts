import { initServer } from '@ts-rest/express';
import { bankQueryHandlers } from './query';
import { bankMutationHandlers } from './mutation';
import { bankContract } from '@srk/shared/contracts';

const s = initServer();

export const bankRouter = s.router(bankContract, {
  sendBankRegistrationOtp: bankMutationHandlers.sendBankRegistrationOtp,
  getBankDetailsByUserId: bankQueryHandlers.getBankDetailsByUserId,
  getBankDetailsByAccountNumber:
    bankQueryHandlers.getBankDetailsByAccountNumber,
  getBankBalance: bankQueryHandlers.getBankBalance,
  getBankStatus: bankQueryHandlers.getBankStatus,
  createBankDetails: bankMutationHandlers.createBankDetails,
  updateBankDetails: bankMutationHandlers.updateBankDetails,
  sendMoney: bankMutationHandlers.sendMoney,
  validateTransactionPIN: bankMutationHandlers.validateTransactionPIN,
  validateBankRegistrationOtp: bankMutationHandlers.validateBankRegistrationOtp,
  uploadBankProfilePicture: bankMutationHandlers.uploadBankProfilePicture,
  createBankTransactionPin: bankMutationHandlers.createBankTransactionPin,
  paymentIntent: bankMutationHandlers.createPaymentIntent,
});
