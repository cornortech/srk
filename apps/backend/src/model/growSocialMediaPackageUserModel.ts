import mongoose from 'mongoose';

export interface IGrowSocialMediaPackageUser extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  country: string;
  kycURL: string[];
  status: 'verificationPending' | 'portalActivated' | 'verificationRejected';
  promoCode?: string;
  userType: 'affiliate' | 'package';
  srkUniversityUserId?: mongoose.Types.ObjectId;
  referredBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const growSocialMediaPackageUserSchema = new mongoose.Schema(
  {
    fullName: {
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
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    kycURL: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ['verificationPending', 'portalActivated', 'verificationRejected'],
      default: 'verificationPending',
    },
    promoCode: {
      type: String,
    },
    srkUniversityUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'growSocialMediaPackageUser',
    },
    isEmailNotifications: {
      type: Boolean,
      default: null,
    },
    isPushNotifications: {
      type: Boolean,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const growSocialMediaPackageUserModel = mongoose.model(
  'growSocialMediaPackageUser',
  growSocialMediaPackageUserSchema
);
