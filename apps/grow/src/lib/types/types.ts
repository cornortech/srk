export type SocialPlatform =
  | 'youtube'
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'tiktok';
export type EngagementType = 'follow' | 'reach';
export type KYCStatus =
  | 'verificationPending'
  | 'portalActivated'
  | 'verificationRejected';

export interface PackageSubType {
  _id: string;
  growSocialMediaPackageTypeId: string;
  name: string;
  description: string;
  noOfLikes?: number;
  noOfVideos?: number;
  noOfFollowers?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PackageType {
  _id: string;
  growSocialMediaPackageId: string;
  name: string;
  description: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  packageSubTypes: PackageSubType[];
}

export interface PackageDetails {
  _id: string;
  name: string;
  description: string;
  socialMediaPlatforms: string[];
  amountBeforeDiscount?: number;
  amount: number;
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
  packageTypes: PackageType[];
}

export interface UserData {
  _id: string; // Changed from id to _id
  fullName: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  country: string;
  kycURL: string[];
  status: KYCStatus;
  promoCode: string;
  rejectionReason?: string; // Added field
  srkUniversityUserId: string;
  referredBy: string;
  transactionId?: string;
  paymentProofUrl?: string;
  kycDocuments?: {
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
    status: KYCStatus;
    submittedAt: string;
  }[];
  createdAt?: string;
  lastLogin?: string;
}

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
  user: UserData;
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

export interface DiscountDetails {
  originalAmount: number;
  discountPercentage: number;
  discountAmount: number;
  finalAmountAfterDiscount: number;
}
