import { initServer } from '@ts-rest/express';
import { growContract } from '@srk/shared/contracts';
import { growMutationHandler } from './mutation';
import { growQueryHandler } from './query';

const s = initServer();

export const growRouter = s.router(growContract, {
  getAllGrowSocialMediaEnrollement: growQueryHandler.getAllSrkGrowEnrollmentUser,
  getGrowSocialMediaEnrollmentById:
    growQueryHandler.getSrkGrowEnrollmentUserById,
  getAllSrkGrowUsers: growQueryHandler.getAllSrkGrowUsers,
  createGrowSocialMediaEnrollment:
    growMutationHandler.createGrowSocialMediaEnrollment,
  validateGrowUserPromoCode: growMutationHandler.validateGrowUserPromoCode,
  acceptSocialGrowEnrollmentRequest:
    growMutationHandler.acceptSocialGrowEnrollmentRequest,
  rejectSocialGrowEnrollmentRequest:
    growMutationHandler.rejectSocialGrowEnrollmentRequest,
  getSrkGrowProfile: growQueryHandler.getSrkGrowProfile,
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
});
