import mongoose from 'mongoose';

const rewardClaimSchema = new mongoose.Schema(
  {
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    earningAtClaim: { type: Number, required: true },
  },
  { timestamps: true }
);

// One claim per user per reward; also makes double-clicks safe
rewardClaimSchema.index({ rewardId: 1, userId: 1 }, { unique: true });
rewardClaimSchema.index({ createdAt: -1 });

export const RewardClaimModel = mongoose.model(
  'RewardClaim',
  rewardClaimSchema
);
