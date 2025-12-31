import mongoose from 'mongoose';

const srkTasksEarningsPayoutSchema = new mongoose.Schema(
  {
    taskUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'srkTaskUser',
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    coinsUsed: {
      type: Number,
      required: true,
    },
    tds: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
    paymentScreenshotUrl: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const srkTasksEarningsPayoutModel = mongoose.model(
  'srkTasksEarningsPayout',
  srkTasksEarningsPayoutSchema
);
