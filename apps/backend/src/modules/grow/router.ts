import { initServer } from '@ts-rest/express';
import { growContract } from '@srk/shared/contracts';
import { growMutationHandler } from './mutation';
import { growQueryHandler } from './query';
import { withErrorHandling } from '../../utils/tsRestErrorHandler';

const s = initServer();

export const growRouter = s.router(growContract, {
  getAllGrowSocialMediaEnrollement:
    withErrorHandling(growQueryHandler.getAllSrkGrowEnrollmentUser),
  getGrowSocialMediaEnrollmentById:
    withErrorHandling(growQueryHandler.getSrkGrowEnrollmentUserById),
  getAllSrkGrowUsers: withErrorHandling(growQueryHandler.getAllSrkGrowUsers),
  getAllSrkGrowAffiliateUsers: withErrorHandling(growQueryHandler.getAllSrkGrowAffiliateUsers),
  createGrowSocialMediaEnrollment:
    withErrorHandling(growMutationHandler.createGrowSocialMediaEnrollment),
  validateGrowUserPromoCode: withErrorHandling(growMutationHandler.validateGrowUserPromoCode),
  acceptSocialGrowEnrollmentRequest:
    withErrorHandling(growMutationHandler.acceptSocialGrowEnrollmentRequest),
  rejectSocialGrowEnrollmentRequest:
    withErrorHandling(growMutationHandler.rejectSocialGrowEnrollmentRequest),
  getSrkGrowProfile: withErrorHandling(growQueryHandler.getSrkGrowProfile),
  getGrowAffiliateUser: withErrorHandling(growQueryHandler.getGrowAffiliateUser),
  resubmitGrowVerification: withErrorHandling(growMutationHandler.resubmitGrowVerification),
  createGrowSocialMediaTasks: withErrorHandling(growMutationHandler.createGrowSocialMediaTasks),
  approveSrkGrowAffiliateVerificationRequest:
    withErrorHandling(growMutationHandler.approveSrkGrowAffiliateVerificationRequest),
  rejectSrkGrowAffiliateVerificationRequest:
    withErrorHandling(growMutationHandler.rejectSrkGrowAffiliateVerificationRequest),
  getAllSrkGrowAffiliateVerificationRequest:
    withErrorHandling(growQueryHandler.getAllSrkGrowAffiliateVerificationRequest),
  srkGrowAffiliateVerificationRequest:
    withErrorHandling(growMutationHandler.srkGrowAffiliateVerificationRequest),

  // Affiliate Earning Payout Endpoints
  createGrowSrkAffiliateEarningPayoutRequest:
    withErrorHandling(growMutationHandler.createGrowSrkAffiliateEarningPayoutRequest),
  acceptGrowSrkAffiliateEarningPayoutRequestByAdmin:
    withErrorHandling(growMutationHandler.acceptGrowSrkAffiliateEarningPayoutRequestByAdmin),
  rejectGrowSrkAffiliateEarningPayoutRequestByAdmin:
    withErrorHandling(growMutationHandler.rejectGrowSrkAffiliateEarningPayoutRequestByAdmin),
  getSrkGrowAffiliateEarningPayoutRequestByAdmin:
    withErrorHandling(growQueryHandler.getSrkGrowAffiliateEarningPayoutRequestByAdmin),
  getSrkGrowAffiliateEarningPayoutRequestByUser:
    withErrorHandling(growQueryHandler.getSrkGrowAffiliateEarningPayoutRequestByUser),
  getSrkGrowAffiliateVerificationRequest:
    withErrorHandling(growQueryHandler.getSrkGrowAffiliateVerificationRequest),
  getTaskMonitoring: withErrorHandling(growQueryHandler.getTaskMonitoring),
  toggleEnrollmentActiveStatus:
    withErrorHandling(growMutationHandler.toggleEnrollmentActiveStatus),
  getGlobalOverview: withErrorHandling(growQueryHandler.getGlobalOverview),
});
