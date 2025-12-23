import mongoose from 'mongoose';

const adminBalanceSchema = new mongoose.Schema(
  {
    ceoSalary: {
      type: Number,
      default: 0,
    },
    officeManagementCharge: {
      type: Number,
      default: 0,
    },
    companyTurnover: {
      type: Number,
      default: 0,
    },
    tdsAmount: {
      type: Number,
      default: 0,
    },
    eventWallet: {
      type: Number,
      default: 0,
    },
    companyWallet: {
      type: Number,
      default: 0,
    },
    tms: {
      type: Number,
      default: 0,
    },
    vat: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const adminBalanceModel = mongoose.model(
  'AdminBalance',
  adminBalanceSchema
);
