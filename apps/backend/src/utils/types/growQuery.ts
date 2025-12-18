import { Types } from "mongoose";

export interface GrowUserPopulated {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  gender: "Male" | "Female" | "Other";
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
    status: "verificationPending" | "portalActivated" | "portalDeactivated";
    referredBy?: {
      _id: Types.ObjectId;
      fullName: string;
    };
  }
  growSocialMediaPackageId: {
    _id: Types.ObjectId;
    name: string;
  };
}