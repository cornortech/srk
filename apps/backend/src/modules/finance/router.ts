import { initServer } from '@ts-rest/express';
import { financeContract } from '@srk/shared/contracts';
import { financeMutationHandler } from './mutation';
import { financeQueryHandler } from './query';
import { createDataUrlUploadMiddleware } from '../../utils/dataUrlUploadMiddleware';

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
  getSrkBankDetailsForAdmin: financeQueryHandler.getSrkBankDetailsForAdmin,
  createBalancePayout: financeMutationHandler.createBalancePayout,
  getAllBalancePayoutOfUser: financeQueryHandler.getAllBalancePayoutOfUser,
  upsertBankDetails: financeMutationHandler.upsertBankDetails,
  upsertKYCDetails: {
    middleware: [createDataUrlUploadMiddleware(kycFieldMappings)],
    handler: financeMutationHandler.upsertKYCDetails,
  },
  getFinanceDetailsOfUser: financeQueryHandler.getFinanceDetailsOfUser,
  getEarningLeaderboard: financeQueryHandler.getEarningLeaderboard,
  getAllBalancePayoutsByStatus:
    financeQueryHandler.getAllBalancePayoutsByStatus,
  approveBalancePayout: financeMutationHandler.approveBalancePayout,
  rejectBalancePayout: financeMutationHandler.rejectBalancePayout,
  getAdminEarningDetails: financeQueryHandler.getAdminEarningDetails,
  getBankStatementOfUser: financeQueryHandler.getBankStatementOfUser,
  srkBankPayoutRequest: financeMutationHandler.srkBankPayoutRequest,
  getBankStatementForAdmin: financeQueryHandler.getBankStatementForAdmin,
  createSrkUniversityPayout: financeMutationHandler.createSrkUniversityPayout,
  getAllSrkUniversityBankStatement:
    financeQueryHandler.getAllSrkUniversityBankStatement,
  srkBankPayoutRequestForAdmin:
    financeMutationHandler.srkBankPayoutRequestForAdmin,
  approveBankDetails: financeMutationHandler.approveBankDetails,
  getBankTable: financeQueryHandler.getBankTable,
  rejectBankRequest: financeMutationHandler.rejectBankRequest,
  getTeamCashflowOfUser: financeQueryHandler.getTeamCashflowOfUser,
  getSrkBonusFlowForAdmin: financeQueryHandler.getSrkBonusFlowForAdmin,
});
