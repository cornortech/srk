// models/PaymentIntent.ts
import mongoose from 'mongoose';

export interface IPaymentIntent extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  senderBankId: mongoose.Types.ObjectId;
  receiverBankId: mongoose.Types.ObjectId;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'failed' | 'cancelled';
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentIntentSchema = new mongoose.Schema<IPaymentIntent>(
  {
    senderBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SrkBank',
      required: true,
    },
    receiverBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SrkBank',
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    idempotencyKey: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export const PaymentIntentModel = mongoose.model(
  'PaymentIntent',
  paymentIntentSchema
);
