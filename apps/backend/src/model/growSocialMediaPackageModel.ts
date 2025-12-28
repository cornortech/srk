import mongoose from 'mongoose';

export interface IGrowSocialMediaPackage extends mongoose.Document {
  name: string;
  description: string;
  socialMediaPlatforms: string[];
  features: string[];
  amountBeforeDiscount: number;
  amount: number;
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const growSocialMediaPackageSchema =
  new mongoose.Schema<IGrowSocialMediaPackage>(
    {
      name: {
        type: String,
        requred: true,
      },
      description: {
        type: String,
        required: true,
      },
      socialMediaPlatforms: {
        type: [String],
        enum: ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Facebook'],
        default: [],
      },
      features: {
        type: [String],
        required: true,
      },
      amountBeforeDiscount: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      isPopular: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

export const growSocialMediaPackageModel = mongoose.model(
  'growSocialMediaPackage',
  growSocialMediaPackageSchema
);
