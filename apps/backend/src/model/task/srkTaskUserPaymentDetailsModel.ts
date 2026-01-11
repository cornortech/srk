import mongoose from 'mongoose';

export interface ISrkTaskUserPaymentDetails extends mongoose.Document {
  srkTaskUserId: mongoose.Types.ObjectId;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  branchName: string;
  qrCodeUrl: string; // URL to uploaded QR code image
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const srkTaskUserPaymentDetailsSchema = new mongoose.Schema(
  {
    srkTaskUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'srkTaskUser',
      required: true,
      unique: true, // One payment detail per user
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    qrCodeUrl: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const srkTaskUserPaymentDetailsModel =
  mongoose.model<ISrkTaskUserPaymentDetails>(
    'srkTaskUserPaymentDetails',
    srkTaskUserPaymentDetailsSchema
  );
