import mongoose from 'mongoose';

export interface ISrkTaskReward extends mongoose.Document {
  title: string;
  description: string;
  photoUrl: string;
  requiredCoins: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const srkTaskRewardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    photoUrl: { type: String, required: true },
    // Lifetime coins a user must have earned to unlock this reward
    requiredCoins: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

srkTaskRewardSchema.index({ createdAt: -1 });

export const srkTaskRewardModel = mongoose.model<ISrkTaskReward>(
  'srkTaskReward',
  srkTaskRewardSchema
);
