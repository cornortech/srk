import mongoose from "mongoose";

const bankStatementSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      // deposit deposit to srk bank throught balance
      // payout_request - payout request to admin
      // payout - payout to user
      enum: ["deposit", "payout_request", "payout", "refunded"],
    },
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SrkBank",
    },
    srkUniversityBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SrkUniversityBank",
    },
    currentAmount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BankStatement", bankStatementSchema);
