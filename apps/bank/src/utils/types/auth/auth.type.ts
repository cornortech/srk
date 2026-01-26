export type TSrkBankStatus =
  | "ONBOARDING_DETAILS_ADDED"
  | "OTP_VERIFIED"
  | "PROFILE_PICTURE_UPLOADED"
  | "TRANSACTION_PIN_ADDED"
  | "PORTAL_ACTIVATED"
  | "REJECTED";


  export type TPackage = {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  discountedPrice: number;
  features: {
    text: string;
    included: boolean;
  }[]; // Assuming it's an array of strings, you can change it depending on your actual structure
  image?: string; // Optional field since it might not always be present
  createdAt?: Date; // This will be automatically managed by the `timestamps` option in the schema
  updatedAt?: Date; // This will be automatically managed as well
};

  export type TUser = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  referralCode: string;
  profilePicture?: string;
  affiliateEnabled: boolean;
  allowedToAddUsers?: boolean;
  isActive: boolean;
  hasSrkBonusDeposited?: boolean;
  dob: string;
  gender: "Male" | "Female" | "Other";
  status:
    | "REGISTERED"
    | "PAYMENT_VERIFICATION_PENDING"
    | "PAYMENT_VERIFICATION_APPROVED"
    | "PAYMENT_VERIFICATION_REJECTED"
    | "KYC_VERIFICATION_REJECTED"
    | "KYC_VERIFICATION_PENDING"
    | "PORTAL_ACTIVATED"
    | "PORTAL_DEACTIVATED";
  purpose: "affiliate" | "study";
  phoneNumber: string;
  referredBy?: string;
  packageId: TPackage;
  createdAt?: Date; // This will be automatically managed by the `timestamps` option in the schema
  updatedAt?: Date; // This will be automatically managed as well
};


export type TSrkBank = {
  _id: string;
  accountNumber: string | null;
  status: TSrkBankStatus | null;
  amount: number;
};

export type TAuthState = {
  refresh: boolean;
  authDetails: {
    role: "admin" | "user";
    email: string;
    redirectionUrl: string;
  };
  srkBank: TSrkBank | null;
  toggleRefresh: () => void;
  userDetails: (TUser & { redirectionUrl: string }) | null;
  setAuthDetails: (details: {
    authDetails: {
      role: "admin" | "user";
      email: string;
      redirectionUrl: string;
    };
    srkBank: TSrkBank | null;
    userDetails: (TUser & { redirectionUrl: string }) | null;
  }) => void;
  clearAuthDetails: () => void;
};

export interface IBankUser{
  _id: string;
  email: string;
  fullName: string;
}