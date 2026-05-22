import mongoose from "mongoose";

const kycSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    frontImage: {
      type: String,
      required: true,
    },
    backImage: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      required: true,
    },
    verificationImage: {
      required: true,
      type: String,
    },
    documentNumber: {
      type: String,
      required: true,
    },
    leftThumbFingerprint: {
      type: String,
      default: null,
    },
    rightThumbFingerprint: {
      type: String,
      default: null,
    },
    signature: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    courseEnrollAgreement: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
    kyc_approved_date: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const KYCModel = mongoose.model("KYC", kycSchema);