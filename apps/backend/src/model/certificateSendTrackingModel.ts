import mongoose from 'mongoose';
import { Types } from 'mongoose';

export interface ICertificateSendTracking extends mongoose.Document {
  userId: Types.ObjectId;
  userEmail: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  certificateAssetUrl?: string;
  error?: string;
}

const certificateSendTrackingSchema = new mongoose.Schema<ICertificateSendTracking>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
    },
    certificateAssetUrl: {
      type: String,
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const CertificateSendTrackingModel = mongoose.model<ICertificateSendTracking>(
  'CertificateSendTracking',
  certificateSendTrackingSchema
);
