import mongoose from "mongoose";

const commissionTransactionSchema = new mongoose.Schema(
  {
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referredTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    earning: {
      type: Number,
      required: true,
    },
    srkBonus: {
      type: Number,
      required: true,
    },
    eventWallet: {
      type: Number,
      required: true,
    },
    ceoSalary: {
      type: Number,
      required: true,
    },
    officeManagementCharge: {
      type: Number,
      required: true,
    },
    companyTurnover: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CommissionTransactionModel = mongoose.model(
  "CommissionTransaction",
  commissionTransactionSchema
);
