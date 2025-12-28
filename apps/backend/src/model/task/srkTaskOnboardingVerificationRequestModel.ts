import mongoose from 'mongoose';

const srkTaskOnboardingVerificationRequestSchema = new mongoose.Schema(
  {
    taskUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'srkTaskUser',
      required: true,
    },
    kycDocumentUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    signatureUrl: {
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

export const srkTaskOnboardingVerificationRequestModel = mongoose.model(
  'srkTaskOnboardingVerificationRequest',
  srkTaskOnboardingVerificationRequestSchema
);
