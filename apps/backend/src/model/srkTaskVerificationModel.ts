import mongoose from 'mongoose';

const srkTaskUserVerificationSchema = new mongoose.Schema(
  {
    srkAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    verificationImageUrl: {
      type: String,
      required: true,
    },
    verificationDocumentUrl: {
      type: String,
      required: true,
    },
    signatureImageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const SrkTaskUserVerificationModel = mongoose.model(
  'SrkTaskUserVerification',
  srkTaskUserVerificationSchema
);

export default SrkTaskUserVerificationModel;
