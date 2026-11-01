import mongoose from 'mongoose';

export interface ISrkTaskRewardClaim extends mongoose.Document {
  rewardId: mongoose.Types.ObjectId;
  taskUserId: mongoose.Types.ObjectId;
  coinsAtClaim: number;
  createdAt: Date;
  updatedAt: Date;
}

const srkTaskRewardClaimSchema = new mongoose.Schema(
  {
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'srkTaskReward',
      required: true,
    },
    taskUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'srkTaskUser',
      required: true,
    },
    coinsAtClaim: { type: Number, required: true },
  },
  { timestamps: true }
);

// One claim per user per reward; also makes double-clicks safe
srkTaskRewardClaimSchema.index({ rewardId: 1, taskUserId: 1 }, { unique: true });
srkTaskRewardClaimSchema.index({ createdAt: -1 });

export const srkTaskRewardClaimModel = mongoose.model<ISrkTaskRewardClaim>(
  'srkTaskRewardClaim',
  srkTaskRewardClaimSchema
);
