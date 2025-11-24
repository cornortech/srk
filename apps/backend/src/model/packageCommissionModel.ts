import mongoose from 'mongoose';

const packageCommissionSchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package', // Linking to PackageModel
    required: true,
  },
  affiliateCommission: { type: Number, required: true },
  eventWallet: { type: Number, required: true },
  srkBonus: { type: Number, required: true },
  ceoSalary: { type: Number, required: true },
  officeManagementCharge: { type: Number, required: true },
  companyTurnover: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const PackageCommissionModel = mongoose.model(
  'PackageCommission',
  packageCommissionSchema
);