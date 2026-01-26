import mongoose from "mongoose";

export interface IBankStatement extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  amount: number;
  description?: string;
  type:
    | "deposit"
    | "payout_request"
    | "payout"
    | "refunded"
    | "send"
    | "receive";
  status: "pending" | "completed" | "failed" | "cancelled";
  bankId?: mongoose.Types.ObjectId;
  receiverBankId?: mongoose.Types.ObjectId;
  srkUniversityBankId?: mongoose.Types.ObjectId;
  currentAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const bankStatementSchema = new mongoose.Schema<IBankStatement>(
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
      // refunded - refunded to user
      // send - send money to another user
      // receive - receive money from another user
      enum: [
        "deposit",
        "payout_request",
        "payout",
        "refunded",
        "send",
        "receive",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed", "cancelled"],
    },
    // initiated by user
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SrkBank",
    },
    receiverBankId: {
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

const BankStatementModel = mongoose.model("BankStatement", bankStatementSchema);

export default BankStatementModel;
