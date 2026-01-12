import mongoose from 'mongoose';

const adminModelSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
      enum: ['university', 'grow', 'task'],
    },
  },
  {
    timestamps: true,
  }
);

export const adminModel = mongoose.model('Admin', adminModelSchema);
