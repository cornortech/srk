import mongoose from 'mongoose';

const srkTaskActionSubmissionSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ['follow', 'like'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    screenshotUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const srkTaskActionSubmissionModel = mongoose.model(
  'srkTaskActionSubmission',
  srkTaskActionSubmissionSchema
);
