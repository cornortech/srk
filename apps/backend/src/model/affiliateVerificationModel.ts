import mongoose from "mongoose";

const affiliateBiometricSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    verificationImage: {
      type: String,
      required: true,
    },
    leftThumbPrint: {
      type: String,
      required: true,
    },
    rightThumbPrint: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const affiliateBiometricModel = mongoose.model(
  "affiliateBiometric",
  affiliateBiometricSchema
);
