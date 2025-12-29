import { initServer } from '@ts-rest/express';
import { srkTaskContract } from '@srk/shared/contracts';
import { srkTaskQueryHandler } from './query';
import { srkTaskMutationHandler } from './mutation';

const s = initServer();

export const srkTaskRouter = s.router(srkTaskContract, {
  getSrkTaskUserProfile: srkTaskQueryHandler.getSrkTaskUserProfile,
  getSrkTaskUserAnalystics: srkTaskQueryHandler.getSrkTaskUserAnalystics,
  getAllSrkTaskUserEarningsLeaderboard:
    srkTaskQueryHandler.getAllSrkTaskUserEarningsLeaderboard,
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
  approveSrkTaskActionByAdmin:
    srkTaskMutationHandler.approveSrkTaskActionByAdmin,
  rejectSrkTaskActionByAdmin: srkTaskMutationHandler.rejectSrkTaskActionByAdmin,
  srkTaskActionSubmission: srkTaskMutationHandler.srkTaskActionSubmission,
});