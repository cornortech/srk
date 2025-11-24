import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
    features: [
      new mongoose.Schema({
        text: {
          type: String,
          required: true,
        },
        included: {
          type: Boolean,
          required: true,
        },
      }),
    ],
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export const PackageModel = mongoose.model('Package', packageSchema);
