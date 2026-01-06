import mongoose from 'mongoose';

const growSrkAffiliateUserBalanceSchema = new mongoose.Schema(
  {
    growAffiliateUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'growAffiliateUser',
      required: true,
    },
    wallet: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const growSrkAffiliateUserBalanceModel = mongoose.model(
  'growSrkAffiliateUserBalance',
  growSrkAffiliateUserBalanceSchema
);