import { initServer } from '@ts-rest/express';
import { financeContract } from '@srk/shared/contracts';
import { financeMutationHandler } from './mutation';
import { financeQueryHandler } from './query';
import { createDataUrlUploadMiddleware } from '../../utils/dataUrlUploadMiddleware';
import { withErrorHandling } from '../../utils/tsRestErrorHandler';

const s = initServer();

// KYC field mappings for image upload middleware
const kycFieldMappings = {
  frontImage: { folder: 'university/kyc', prefix: 'university-kyc-front' },
  backImage: { folder: 'university/kyc', prefix: 'university-kyc-back' },
  verificationImage: { folder: 'university/kyc', prefix: 'university-kyc-verification' },
  leftThumbFingerprint: { folder: 'university/kyc', prefix: 'university-kyc-left-thumb' },
  rightThumbFingerprint: { folder: 'university/kyc', prefix: 'university-kyc-right-thumb' },
  signature: { folder: 'university/kyc', prefix: 'university-kyc-signature' },
};

export const financeRouter = s.router(financeContract, {
  getSrkBankDetailsForAdmin: withErrorHandling(financeQueryHandler.getSrkBankDetailsForAdmin),
  createBalancePayout: withErrorHandling(financeMutationHandler.createBalancePayout),
  getAllBalancePayoutOfUser: withErrorHandling(financeQueryHandler.getAllBalancePayoutOfUser),
  upsertBankDetails: withErrorHandling(financeMutationHandler.upsertBankDetails),
  upsertKYCDetails: {
    middleware: [createDataUrlUploadMiddleware(kycFieldMappings)],
    handler: withErrorHandling(financeMutationHandler.upsertKYCDetails),
  },
  getFinanceDetailsOfUser: withErrorHandling(financeQueryHandler.getFinanceDetailsOfUser),
  getEarningLeaderboard: withErrorHandling(financeQueryHandler.getEarningLeaderboard),
  getAllBalancePayoutsByStatus:
    withErrorHandling(financeQueryHandler.getAllBalancePayoutsByStatus),
  approveBalancePayout: withErrorHandling(financeMutationHandler.approveBalancePayout),
  rejectBalancePayout: withErrorHandling(financeMutationHandler.rejectBalancePayout),
  getAdminEarningDetails: withErrorHandling(financeQueryHandler.getAdminEarningDetails),
  getBankStatementOfUser: withErrorHandling(financeQueryHandler.getBankStatementOfUser),
  srkBankPayoutRequest: withErrorHandling(financeMutationHandler.srkBankPayoutRequest),
  getBankStatementForAdmin: withErrorHandling(financeQueryHandler.getBankStatementForAdmin),
  createSrkUniversityPayout: withErrorHandling(financeMutationHandler.createSrkUniversityPayout),
  getAllSrkUniversityBankStatement:
    withErrorHandling(financeQueryHandler.getAllSrkUniversityBankStatement),
  srkBankPayoutRequestForAdmin:
    withErrorHandling(financeMutationHandler.srkBankPayoutRequestForAdmin),
  approveBankDetails: withErrorHandling(financeMutationHandler.approveBankDetails),
  getBankTable: withErrorHandling(financeQueryHandler.getBankTable),
  rejectBankRequest: withErrorHandling(financeMutationHandler.rejectBankRequest),
  getTeamCashflowOfUser: withErrorHandling(financeQueryHandler.getTeamCashflowOfUser),
  getSrkBonusFlowForAdmin: withErrorHandling(financeQueryHandler.getSrkBonusFlowForAdmin),
});
