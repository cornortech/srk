import mongoose from 'mongoose';

export interface ISrkTaskUserPaymentDetailsRequest extends mongoose.Document {
  srkTaskUserId: mongoose.Types.ObjectId;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  branchName: string;
  qrCodeUrl: string; // URL to uploaded QR code image
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewedBy?: mongoose.Types.ObjectId; // Admin who reviewed
  reviewedAt?: Date;
  isActive: boolean; // Only one approved request can be active at a time
  createdAt: Date;
  updatedAt: Date;
}

const srkTaskUserPaymentDetailsRequestSchema = new mongoose.Schema(
  {
    srkTaskUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'srkTaskUser',
      required: true,
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
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
    },
    reviewedAt: {
      type: Date,
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

// Index for faster queries
srkTaskUserPaymentDetailsRequestSchema.index({ srkTaskUserId: 1, status: 1 });

export const srkTaskUserPaymentDetailsRequestModel =
  mongoose.model<ISrkTaskUserPaymentDetailsRequest>(
    'srkTaskUserPaymentDetailsRequest',
    srkTaskUserPaymentDetailsRequestSchema
  );
