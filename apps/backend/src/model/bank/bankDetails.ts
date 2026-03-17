import mongoose from 'mongoose';

const bankDetailsSchema = new mongoose.Schema({
  srkBankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SrkBank',
    required: true,
  },
  basicInfo: {
    profilePicture: {
      type: String,
    },
  },
  familyDetails: {
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    spouseName: { type: String },
    childrenNames: [{ type: String }],
  },
  permanentAddress: {
    country: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    municipality: { type: String, required: true },
    wardNo: { type: String, required: true },
    street: { type: String, required: true },
  },
  currentAddress: {
    country: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    municipality: { type: String, required: true },
    wardNo: { type: String, required: true },
    street: { type: String, required: true },
  },
  identificationDetails: {
    idType: { type: String, required: true },
    idNumber: { type: String, required: true },
    issuedDate: { type: Date, required: true },
    issuedFrom: { type: String, required: true },
    // nidAuthority: { type: String, required: true },
  },
  documents: {
    ppSizePhoto: { type: String, required: true },
    nationalIdCard: { type: String, required: true },
  },
});

export const BankDetailsModel = mongoose.model(
  'BankDetails',
  bankDetailsSchema,
);
