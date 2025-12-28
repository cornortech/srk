import mongoose from 'mongoose';

const srkTaskUserBalanceSchema = new mongoose.Schema(
  {
    taskUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'srkTaskUser',
      required: true,
    },
    totalCoins: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const srkTaskUserBalanceModel = mongoose.model(
  'srkTaskUserBalance',
  srkTaskUserBalanceSchema
);
