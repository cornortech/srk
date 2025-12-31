import mongoose from 'mongoose';

const srkTaskActionSubmissionSchema = new mongoose.Schema(
  {
    taskUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'taskUser',
      required: true,
    },
    growEnrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'growSocialMediaPackageEnrollment',
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
