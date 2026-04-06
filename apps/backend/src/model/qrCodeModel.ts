import mongoose from 'mongoose';
import { PaymentQRType } from '@srk/shared/contracts';

export interface IQRCode extends Document {
  name: string;
  qr: string; // Base64 encoded image or URL
  isAvailable: boolean;
  type: PaymentQRType;
  createdAt: Date;
  updatedAt: Date;
}

const QRCodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'QR code name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    qr: {
      type: String,
      required: [true, 'QR code image is required'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: Object.values(PaymentQRType),
      required: [true, 'QR code type is required'],
    },
  },
  {
    timestamps: true,
  },
);

export const QRCodeModel = mongoose.model<IQRCode>('QRCode', QRCodeSchema);
