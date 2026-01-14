import mongoose from "mongoose";

import { Types, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  dob: Date;
  country: string;
  email: string;
  password: string;

  affiliateEnabled: boolean;
  allowedToAddUsers: boolean;

  profilePicture?: string;

  referralCode?: string;
  referredBy?: Types.ObjectId;

  packageId?: Types.ObjectId;

  status:
    | "REGISTERED"
    | "PAYMENT_VERIFICATION_PENDING"
    | "PAYMENT_VERIFICATION_REJECTED"
    | "PAYMENT_VERIFICATION_APPROVED"
    | "KYC_VERIFICATION_PENDING"
    | "KYC_VERIFICATION_REJECTED"
    | "PORTAL_ACTIVATED"
    | "PORTAL_DEACTIVATED";

  hasSrkBonusDeposited: boolean;
  isSelfSignup: boolean;

  purpose?: "affiliate" | "study";

  srkBankId?: Types.ObjectId;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}


const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    affiliateEnabled: {
      type: Boolean,
      default: false,
    },
    allowedToAddUsers: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
    },
    referralCode: {
      type: String,
      unique: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
    status: {
      type: String,
      required: true,
      enum: [
        "REGISTERED",
        "PAYMENT_VERIFICATION_PENDING",
        "PAYMENT_VERIFICATION_REJECTED",
        "PAYMENT_VERIFICATION_APPROVED",
        "KYC_VERIFICATION_PENDING",
        "KYC_VERIFICATION_REJECTED",
        "PORTAL_ACTIVATED",
        "PORTAL_DEACTIVATED",
      ],
      default: "PAYMENT_VERIFICATION_PENDING",
    },
    hasSrkBonusDeposited: {
      type: Boolean,
      default: false,
    },
    isSelfSignup: {
      type: Boolean,
      default: true,
    },
    purpose: {
      type: String,
      enum: ["affiliate", "study"],
    },
    srkBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SrkBank",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
