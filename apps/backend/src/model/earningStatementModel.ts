import mongoose from 'mongoose';

const earningStatementModelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['REFERRAL_EANRING', 'SENIOR_EARNING'],
    },
    referredTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    balanceWallet: {
      type: Number,
      default: 0,
    },
    // v2 - task management system
    tms: {
      type: Number,
      required: true,
    },
    // v2 - value added task
    vat: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const EarningStatementModel = mongoose.model(
  'EarningStatementModel',
  earningStatementModelSchema
);
