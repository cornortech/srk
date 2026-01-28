import mongoose from "mongoose";

const srkBankSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    accountNumber: {
      type: String,
      unique: true,
      trim: true,
      minlength: [16, "Account number must be 16 digits."],
      maxlength: [16, "Account number must be 16 digits."],
    },
    transactionPIN: {
      type: String,
      // trim: true,
      minLength: [4, "Transaction PIN must be of 4 characters."],
      maxLength: [4, "Transaction PIN must be of 4 characters."],
    },
    password: {
      type: String,
      trim: true,
      minlength: [6, "Password must be at least 6 characters long."],
    },
    status: {
      type: String,
      enum: [
        "ONBOARDING_DETAILS_ADDED",
        "OTP_VERIFIED",
        "PROFILE_PICTURE_UPLOADED",
        "TRANSACTION_PIN_ADDED",
        "PORTAL_ACTIVATED",
        "REJECTED",
      ],
    },
    bankDetailsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankDetails",
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SrkBankModel = mongoose.model("SrkBank", srkBankSchema);