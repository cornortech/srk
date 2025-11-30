import { TSrkBankStatus } from '@srk/shared/types';

export const bankRedirectionStatusPathMap = {
  ONBOARDING_DETAILS_ADDED: '/bank/onboarding/otp-verification',
  OTP_VERIFIED: '/bank/onboarding/upload-image',
  PROFILE_PICTURE_UPLOADED: '/bank/onboarding/setup-pin',
  PORTAL_ACTIVATED: '/bank/dashboard',
  REJECTED: '/bank/onboarding/register',
} as Record<TSrkBankStatus, string>;