import { initServer } from '@ts-rest/express';
import { growContract } from '@srk/shared/contracts';
import { growMutationHandler } from './mutation';
import { growQueryHandler } from './query';

const s = initServer();

export const growRouter = s.router(growContract, {
  getAllGrowSocialMediaEnrollement:
    growQueryHandler.getAllSrkGrowEnrollmentUser,
  getGrowSocialMediaEnrollmentById:
    growQueryHandler.getSrkGrowEnrollmentUserById,
  getAllSrkGrowUsers: growQueryHandler.getAllSrkGrowUsers,
  getAllSrkGrowAffiliateUsers: growQueryHandler.getAllSrkGrowAffiliateUsers,
  createGrowSocialMediaEnrollment:
    growMutationHandler.createGrowSocialMediaEnrollment,
  validateGrowUserPromoCode: growMutationHandler.validateGrowUserPromoCode,
  acceptSocialGrowEnrollmentRequest:
    growMutationHandler.acceptSocialGrowEnrollmentRequest,
  rejectSocialGrowEnrollmentRequest:
    growMutationHandler.rejectSocialGrowEnrollmentRequest,
  getSrkGrowProfile: growQueryHandler.getSrkGrowProfile,
  getGrowAffiliateUser: growQueryHandler.getGrowAffiliateUser,
  resubmitGrowVerification: growMutationHandler.resubmitGrowVerification,
  createGrowSocialMediaTasks: growMutationHandler.createGrowSocialMediaTasks,
  approveSrkGrowAffiliateVerificationRequest:
    growMutationHandler.approveSrkGrowAffiliateVerificationRequest,
  rejectSrkGrowAffiliateVerificationRequest:
    growMutationHandler.rejectSrkGrowAffiliateVerificationRequest,
  getAllSrkGrowAffiliateVerificationRequest:
    growQueryHandler.getAllSrkGrowAffiliateVerificationRequest,
  srkGrowAffiliateVerificationRequest:
    growMutationHandler.srkGrowAffiliateVerificationRequest,

  // Affiliate Earning Payout Endpoints
  createGrowSrkAffiliateEarningPayoutRequest:
    growMutationHandler.createGrowSrkAffiliateEarningPayoutRequest,
  acceptGrowSrkAffiliateEarningPayoutRequestByAdmin:
    growMutationHandler.acceptGrowSrkAffiliateEarningPayoutRequestByAdmin,
  rejectGrowSrkAffiliateEarningPayoutRequestByAdmin:
    growMutationHandler.rejectGrowSrkAffiliateEarningPayoutRequestByAdmin,
  getSrkGrowAffiliateEarningPayoutRequestByAdmin:
    growQueryHandler.getSrkGrowAffiliateEarningPayoutRequestByAdmin,
  getSrkGrowAffiliateEarningPayoutRequestByUser:
    growQueryHandler.getSrkGrowAffiliateEarningPayoutRequestByUser,
  getSrkGrowAffiliateVerificationRequest:
    growQueryHandler.getSrkGrowAffiliateVerificationRequest,
  getTaskMonitoring: growQueryHandler.getTaskMonitoring,
  toggleEnrollmentActiveStatus:
    growMutationHandler.toggleEnrollmentActiveStatus,
  getGlobalOverview: growQueryHandler.getGlobalOverview,
});
