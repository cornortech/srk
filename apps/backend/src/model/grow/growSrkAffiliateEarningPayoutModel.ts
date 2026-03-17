import mongoose from 'mongoose';

export type IGrowSrkAffiliateEarningPayout = {
  growAffiliateUserId: mongoose.Schema.Types.ObjectId;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  transactionId?: string;
  paidAt?: Date;
  rejectionReason?: string;
  paymentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

const growSrkAffiliateEarningPayoutSchema =
  new mongoose.Schema<IGrowSrkAffiliateEarningPayout>(
    {
      growAffiliateUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'growAffiliateUser',
        required: true,
      },
      amount: { type: Number, required: true },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      transactionId: { type: String },
      paidAt: { type: Date },
      rejectionReason: { type: String },
      paymentUrl: { type: String },
    },
    { timestamps: true }
  );

export const GrowSrkAffiliateEarningPayoutModel =
  mongoose.model<IGrowSrkAffiliateEarningPayout>(
    'GrowSrkAffiliateEarningPayout',
    growSrkAffiliateEarningPayoutSchema
  );
