import mongoose from "mongoose";

const SrkUniversityBankSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      default: 0,
    },
    totalPendingPayout: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const SrkUniversityBankModel = mongoose.model(
  "SrkUniversityBank",
  SrkUniversityBankSchema
);
