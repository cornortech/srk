import { initServer } from '@ts-rest/express';
import { financeContract } from '../../../../../libs/shared/contracts/src/index';
import { financeMutationHandler } from './mutation';
import { financeQueryHandler } from './query';
const s = initServer();

export const financeRouter = s.router(financeContract, {
  getSrkBankDetailsForAdmin: financeQueryHandler.getSrkBankDetailsForAdmin,
  createBalancePayout: financeMutationHandler.createBalancePayout,
  getAllBalancePayoutOfUser: financeQueryHandler.getAllBalancePayoutOfUser,
  upsertBankDetails: financeMutationHandler.upsertBankDetails,
  upsertKYCDetails: financeMutationHandler.upsertKYCDetails,
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
  getTaskEarningDetails: financeQueryHandler.getTaskEarningDetails,
  createTaskBalancePayout: financeMutationHandler.createTaskBalancePayout,
});
