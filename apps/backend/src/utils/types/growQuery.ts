import { Types } from 'mongoose';

export interface GrowUserPopulated {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  gender: 'Male' | 'Female' | 'Other';
  kycURL: string;
  usedPromoCode?: string;
  status: string;
}

export interface GrowPackagePopulated {
  _id: Types.ObjectId;
  title: string;
  price: number;
}

export interface GrowEnrollmentPopulated {
  _id: string;
  growSocialMediaPackageUserId: GrowUserPopulated;
  growSocialMediaPackageId: GrowPackagePopulated;
  growSocialMediaPackageTypeId: {
    _id: Types.ObjectId;
    title: string;
  };
  growSocialMediaPackageSubTypeId: {
    _id: Types.ObjectId;
    title: string;
    amount: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface GrowPackageUserPopulated {
  _id: Types.ObjectId;
  growSocialMediaPackageUserId: {
    _id: Types.ObjectId;
    fullName: string;
    status: 'verificationPending' | 'portalActivated' | 'portalDeactivated';
    referredBy?: {
      _id: Types.ObjectId;
      fullName: string;
    };
  };
  growSocialMediaPackageId: {
    _id: Types.ObjectId;
    name: string;
  };
}

export interface UniversityAffiliateUserToGrow {
  _id: Types.ObjectId | string;

  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  dob: Date;
  country: string;
  email: string;

  profilePicture?: string;

  affiliateEnabled: boolean;
  allowedToAddUsers: boolean;

  referralCode?: string;
  referredBy?: Types.ObjectId;
  packageId?: Types.ObjectId;

  status:
    | 'REGISTERED'
    | 'PAYMENT_VERIFICATION_PENDING'
    | 'PAYMENT_VERIFICATION_REJECTED'
    | 'PAYMENT_VERIFICATION_APPROVED'
    | 'KYC_VERIFICATION_PENDING'
    | 'KYC_VERIFICATION_REJECTED'
    | 'PORTAL_ACTIVATED'
    | 'PORTAL_DEACTIVATED';

  hasSrkBonusDeposited: boolean;
  isSelfSignup: boolean;

  purpose?: 'affiliate' | 'study';

  srkBankId?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}
