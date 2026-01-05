import mongoose from 'mongoose';

export interface IGrowAffiliateUser extends mongoose.Document {
  fullName: string;
  email: string;
  gender: string;
  srkUniversityUserId: mongoose.Schema.Types.ObjectId;
  promocode: string;
  createdAt: Date;
  updatedAt: Date;
}

const growAffiliateUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
    },
    promocode: {
      type: String,
      required: true,
      unique: true,
    },
    srkUniversityUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const GrowAffiliateUserModel = mongoose.model<IGrowAffiliateUser>(
  'growAffiliateUser',
  growAffiliateUserSchema
);

export default GrowAffiliateUserModel;
