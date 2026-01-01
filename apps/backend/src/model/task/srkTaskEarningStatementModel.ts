import mongoose from 'mongoose';

const srkTaskEarningStatementSchema = new mongoose.Schema(
  {
    taskUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'srkTaskUser',
      required: true,
    },
    growPackageTodoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'growPackageTodo',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    coin: {
      type: Number,
    },
    coinAfterTransaction: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const srkTaskEarningStatementModel = mongoose.model(
  'srkTaskEarningStatement',
  srkTaskEarningStatementSchema
);
