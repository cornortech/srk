import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    photoUrl: { type: String, required: true },
    // All-time earning a user must reach to unlock this reward
    requiredEarning: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

rewardSchema.index({ createdAt: -1 });

export const RewardModel = mongoose.model('Reward', rewardSchema);
