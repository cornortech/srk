import {
  TSrkGrowPackagesSchema,
  TValidateGrowUserPromoCodeResponse,
  TGetGrowSocialMediaEnrollmentById,
  TGetSrkGrowProfileResponse,
} from '@srk/shared/contracts';

export type SocialPlatform =
  | 'YouTube'
  | 'Facebook'
  | 'Instagram'
  | 'Twitter'
  | 'TikTok';
export type EngagementType = 'follow' | 'reach';
export type KYCStatus =
  | 'verificationPending'
  | 'portalActivated'
  | 'verificationRejected';
export type UserType = 'Affiliate' | 'User';

export type PackageSubType =
  TSrkGrowPackagesSchema['packageTypes'][0]['packageSubTypes'][0];
export type PackageType = TSrkGrowPackagesSchema['packageTypes'][0];
export type PackageDetails = TSrkGrowPackagesSchema;

export type UserData = Omit<
  TGetGrowSocialMediaEnrollmentById['userData'],
  'kycURL'
> & {
  _id: string;
  kycURL?: string[] | string;
  kycDocuments?: KYCDocument[];
  enrollmentData?: any;
  createdAt?: string;
  phone?: string;
};

export interface kycSchema {
  userId: string;
  frontImage: string;
  backImage: string;
  documentType: string;
  verificationImage: string;
  documentNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  courseEnrollAgreement: string;
  rejectionReason: string;
}

export interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserData) => void;
}

export interface KYCDocument {
  id: string;
  name: string;
  status: KYCStatus;
  submittedAt: string;
  url?: string;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  socialLink: string;
  platform: SocialPlatform;
  engagementType: EngagementType;
  selectedOption: number;
  packageId: string;
  additionalInfo?: string;
  postLinks?: string[];
  password?: string;
  confirmPassword?: string;
  country?: string;
  gender?: string;
  promoCode?: string;
  kyc?: string[];
  userType: 'affiliate' | 'package';
}

export interface CheckoutUserDetails extends Omit<UserDetails, 'phone'> {
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  gender: string;
  promoCode: string;
  postLinks?: string[];
  kyc: string[];
}

export interface StatusModalProps {
  status: { type: 'success' | 'error'; message?: string };
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export interface OrderDetails {
  platform: SocialPlatform;
  engagementType: EngagementType;
  selectedOption: number;
  amount: number;
  timestamp: string;
  transactionId: string;
  name: string;
  email: string;
  phone: string;
  socialLink: string;
  packageType: string;
}

export interface DashboardProps {
  user: TGetSrkGrowProfileResponse;
  onLogout: () => void;
}

export interface PlatformData {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  progress: number;
  tasks: number;
  completed: number;
}

export type DiscountDetails =
  TValidateGrowUserPromoCodeResponse['discountDetails'];
