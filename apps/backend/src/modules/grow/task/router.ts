import { initServer } from '@ts-rest/express';
import { srkTaskContract } from '@srk/shared/contracts';
import { srkTaskQueryHandler } from './query';
import { srkTaskMutationHandler } from './mutation';

const s = initServer();

export const srkTaskRouter = s.router(srkTaskContract, {
  getSrkTaskUserProfile: srkTaskQueryHandler.getSrkTaskUserProfile,
  getSrkTaskUserAnalytics: srkTaskQueryHandler.getSrkTaskUserAnalytics,
  getAllSrkTaskUserEarningsLeaderboard:
    srkTaskQueryHandler.getAllSrkTaskUserEarningsLeaderboard,
  getAllSrkTaskEarningPayoutsByAdmin:
    srkTaskQueryHandler.getAllSrkTaskEarningPayoutsByAdmin,
  getSrkTaskOnboardingVerificationRequestForAdmin:
    srkTaskQueryHandler.getSrkTaskOnboardingVerificationRequestForAdmin,
  getAllSrkTasksActionSubmissionByStatusForAdmin:
    srkTaskQueryHandler.getAllSrkTasksActionSubmissionByStatusForAdmin,
  getAllSrkTasksActionSubmissionsByUser:
    srkTaskQueryHandler.getAllSrkTasksActionSubmissionsByUser,
  getSrkTaskUserEarningsPayoutsByUser:
    srkTaskQueryHandler.getSrkTaskUserEarningsPayoutsByUser,
  getAllSrkTaskUserFinanceStatement:
    srkTaskQueryHandler.getAllSrkTaskUserFinanceStatement,
  getAllSrkTaskUsersForAdmin: srkTaskQueryHandler.getAllSrkTaskUsersForAdmin,
  getAllPendingTaskSubmissionsByUserForAdmin:
    srkTaskQueryHandler.getAllPendingTaskSubmissionsByUserForAdmin,
  getAllCompletedSrkTaskSubmissionsForAdmin:
    srkTaskQueryHandler.getAllCompletedSrkTaskSubmissionsForAdmin,
  srkTaskEarningsPayoutRequest:
    srkTaskMutationHandler.srkTaskEarningsPayoutRequest,
  acceptSrkTaskUserEarningsPayout:
    srkTaskMutationHandler.acceptSrkTaskUserEarningsPayout,
  rejectSrkTaskUserEarningsPayout:
    srkTaskMutationHandler.rejectSrkTaskUserEarningsPayout,
  submitSrkTaskOnboardingVerification:
    srkTaskMutationHandler.submitSrkTaskOnboardingVerification,
  approveSrkTaskOnboardingVerificationByAdmin:
    srkTaskMutationHandler.approveSrkTaskOnboardingVerificationByAdmin,
  rejectSrkTaskOnboardingVerificationByAdmin:
    srkTaskMutationHandler.rejectSrkTaskOnboardingVerificationByAdmin,
  approveSrkTaskActionSubmissionByAdmin:
    srkTaskMutationHandler.approveSrkTaskActionSubmissionByAdmin,
  rejectSrkTaskActionSubmissionByAdmin:
    srkTaskMutationHandler.rejectSrkTaskActionSubmissionByAdmin,
  bulkApproveSrkTaskSubmissionsByAdmin:
    srkTaskMutationHandler.bulkApproveSrkTaskSubmissionsByAdmin,
  bulkRejectSrkTaskSubmissionsByAdmin:
    srkTaskMutationHandler.bulkRejectSrkTaskSubmissionsByAdmin,
  srkTaskActionSubmission: srkTaskMutationHandler.srkTaskActionSubmission,
  getSrkTaskActionsByPlatforms:
    srkTaskQueryHandler.getSrkTaskActionsByPlatforms,
  getAllSrkTaskAffiliateVerificationRequest:
    srkTaskQueryHandler.getApprovedSrkTaskAffiliateVerificationRequest,
  getRejectedSrkTaskActionSubmissionsByUser:
    srkTaskQueryHandler.getRejectedSrkTaskActionSubmissionsByUser,
  getUserPaymentDetails: srkTaskQueryHandler.getUserPaymentDetails,
  submitPaymentDetailsRequest:
    srkTaskMutationHandler.submitPaymentDetailsRequest,
  getAllPaymentDetailsRequestsForAdmin:
    srkTaskQueryHandler.getAllPaymentDetailsRequestsForAdmin,
  reviewPaymentDetailsRequest:
    srkTaskMutationHandler.reviewPaymentDetailsRequest,
    claimCoinsForTaskActionSubmission:
    srkTaskMutationHandler.claimCoinsForTaskActionSubmission,
});
