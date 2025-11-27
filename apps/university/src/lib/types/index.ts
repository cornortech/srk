import { TBank, TCoursePayment, TKyc, TPackage, TUser } from "./entities";

export type TAffiliateRequest = {
  userId: string;
  requestedAt: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  userStatus: string;
  firstName: string;
  lastName: string;
  gender: string;
  profilePicture: string;
  phoneNumber: string;
  affiliateAgreementUrl: string;
  verificationImage?: string;
  leftThumbPrint?: string;
  rightThumbPrint?: string;
};

export type TPromoCodeDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
};

export type TRegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  profilePicture?: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  referredBy?: string;
  packageId: string;
  paymentProofUrl: string;
  transactionId: string;
  paymentType: "qr" | "online";
  paymentMethod: "esewa" | "khalti" | "bankTransfer";
  purpose: "affiliate" | "study";
};

export type TUserPayloadLS = {
  _id: string;
  email: string;
  role: "admin" | "user";
  redirectionUrl: string;
};

export type TLoginResponse = {
  success: boolean;
  message: string;
  user: {
    _id: string;
    email: string;
    status: string;
    affiliateEnabled: boolean;
    role: "admin" | "user";
    redirectionUrl: string;
  };
};

export type TAuthState = {
  refresh: boolean;
  toggleRefresh: () => void;
  userDetails: (TUser & { redirectionUrl: string }) | null;
  setAuthDetails: (details: {
    userDetails: TUser & { redirectionUrl: string };
  }) => void;
  clearAuthDetails: () => void;
};

export type TUserDataReponseData = {
  userDetails: TUser;
  bankDetails: TBank | null;
  kycDetails: TKyc | null;
  paymentDetails: TCoursePayment | null;
  affiliateBiometricDetails: {
    leftThumbPrint: string;
    rightThumbPrint: string;
    verificationImage: string;
  } | null;
  affiliateRequestDetails: {
    status: "pending" | "approved" | "rejected";
    rejectionReason: string;
    requestedAt: string;
  } | null;
  redirectionUrl: string;
};

export type TUpdateUserDetails = Partial<TUser>;

export type TRequestAffiliatePayload = {
  userId: string;
};

export type TUpsertBankDetails = {
  accountHolderName: string;
  accountNumber: string;
  qrUrl: string;
  ifscCode?: string;
  bankName: string;
  branchName: string;
  accountType: string;
  relationWithAccount: string;
};

export type TUpsertKYCDetails = {
  frontImage: string;
  backImage: string;
  documentType: string;
  documentNumber: string;
  verificationImage: string;
};

export type TEarningDetails = {
  eventWallet: number;
  srkBonus: number;
  walletBalance: number;
  todayEarnings: number;
  last7DaysEarnings: number;
  last30DaysEarnings: number;
  allTimeEarnings: number;
  totalTds: number;
  totalWithdraw: number;
  srkBankAmount: number;
  totalBankPayout: number;
  tourBalance: number;
};

export type TLeaderBoardData = {
  userId: string;
  username: string;
  profilePicture: string;
  totalEarnings: number;
  country: string;
  position: number;
};

export type TBalancePayout = {
  _id: string;
  username: string;
  paymentProofUrl?: string;
  userId: string;
  totalAmount: number;
  transactionNumber: string;
  qrUrl: string;
  tdsAmount: number;
  paymentMethod?: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  packageTitle: string;
  createdAt: Date;
  updatedAt: Date;
};

export const chipColorsStatusMap = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
} as Record<
  "pending" | "approved" | "rejected",
  "warning" | "success" | "danger"
>;

export type TAffiliateTeam = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  profilePicture: string;
  gender: string;
  phoneNumber: string;
  purpose: "affiliate" | "study" | null;
  packageName: string;
  createdAt: Date;
};

export type TAdminEarnings = {
  ceoSalary: number;
  officeManagementCharge: number;
  companyTurnover: number;
  eventWallet: number;
  tdsAmount: number;
  companyWallet: number;
  totalTurnover: number;
  pendingDistribution: number;
  srkUniversityAmount: number | null;
  srkUniversityPendingAmount: number | null;
};

export type TBankStatement = {
  username: string;
  profilePicture: string;
  type: "deposit" | "payout" | "payout_request" | "refunded";
  amount: number;
  date: string;
  description: string;
  currentAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TGetUserByStatusByResponse = {
  data: TGetAllUsersAdmin[];
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
}

export type TGetAllUsersAdmin = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  profilePicture: string;
  packageId: TPackage;
  purpose: "affiliate" | "study" | null;
  gender: "Male" | "Female" | "Other";
  phoneNumber: string;
  courseEnrollAgreementUrl?: string;
  allowedToAddUsers: boolean;
  isSelfSignup: boolean;
  referredAt: Date;
  dob: Date;
  status:
    | "REGISTERED"
    | "PAYMENT_VERIFICATION_PENDING"
    | "PAYMENT_VERIFICATION_APPROVED"
    | "PAYMENT_VERIFICATION_REJECTED"
    | "KYC_VERIFICATION_PENDING"
    | "KYC_VERIFICATION_REJECTED"
    | "PORTAL_ACTIVATED"
    | "PORTAL_DEACTIVATED";
  isActive: boolean;
  referredBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  seniorUser?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  kycDetails: {
    _id: string;
    status: string;
    rejectionReason: string;
    frontImage: string;
    backImage: string;
    documentType: string;
    documentNumber: string;
    verificationImage: string;
  } | null;
  paymentDetails: {
    paymentProofUrl: string;
    transactionId: string;
    paymentType: "qr" | "onlinePayment";
    paymentMethod: "esewa" | "khalti" | "bankTransfer";
  } | null;
  page: number;
  totalPages: number;
};

export type TUpsertAffiliateBiometricData = {
  verificationImage: string;
  leftThumbPrint: string;
  rightThumbPrint: string;
};

export type TCreatePackagePayload = Omit<
  TPackage,
  "createdAt" | "updatedAt" | "_id"
>;

export type TAdminEarningType =
  | "eventWallet"
  | "srkBonus"
  | "tdsAmount"
  | "ceoSalary"
  | "officeManagementCharge";

export type TAddUserPayload = {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  referredBy?: string;
  packageId: string;
  isAddedByUser: boolean;
  purpose: "affiliate" | "study";
};

export type TUploadVideoPayload = {
  name: string;
  courseId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
};

export type TBankRequest = {
  userId: string;
  profilePicture: string;
  username: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: string;
  relationWithAccount: string;
  status: "pending" | "approved" | "rejected";
  qrUrl: string;
  packageTitle: string;
};

export const userStatusColorMap = {
  REGISTERED: "secondary",
  KYC_VERIFICATION_PENDING: "warning",
  KYC_VERIFICATION_REJECTED: "danger",
  PORTAL_ACTIVATED: "success",
  PAYMENT_VERIFICATION_APPROVED: "warning",
  PAYMENT_VERIFICATION_PENDING: "secondary",
  PAYMENT_VERIFICATION_REJECTED: "danger",
  PORTAL_DEACTIVATED: "danger",
} as Record<
  | "REGISTERED"
  | "PAYMENT_VERIFICATION_PENDING"
  | "PAYMENT_VERIFICATION_APPROVED"
  | "PAYMENT_VERIFICATION_REJECTED"
  | "KYC_VERIFICATION_PENDING"
  | "KYC_VERIFICATION_REJECTED"
  | "PORTAL_ACTIVATED"
  | "PORTAL_DEACTIVATED",
  "secondary" | "warning" | "danger" | "success"
>;

export type TUserStatus =
  | "REGISTERED"
  | "PAYMENT_VERIFICATION_PENDING"
  | "PAYMENT_VERIFICATION_APPROVED"
  | "PAYMENT_VERIFICATION_REJECTED"
  | "KYC_VERIFICATION_PENDING"
  | "KYC_VERIFICATION_REJECTED"
  | "PORTAL_ACTIVATED"
  | "PORTAL_DEACTIVATED";

export type TPaymentMethod = "esewa" | "khalti" | "bankTransfer";
export type TPaymentType = "qr" | "online";

export type TSrkBonusFlow = {
  purpose: "affiliate" | "study";
  username: string;
  package: string;
  registeredUser: string;
  bonusAmount: number;
  createdAt: Date;
};

export type TSrkBonusFlowAdmin = {
  _id: string;
  storeName: string;
  purpose: string;
  email: string;
  noOfSrkBonus: number;
  totalSrkBonus: number;
  registeredAt: Date;
};
