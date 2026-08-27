import mongoose, { Schema, Document } from "mongoose";

export interface ITourTarget extends Document {
  _id: mongoose.Types.ObjectId;
  destination: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  duration: number;
  accommodation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  rating: number;
  image: string;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TourTargetSchema = new Schema<ITourTarget>(
  {
    destination: { type: String, required: true },
    description: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    duration: { type: Number, required: true },
    accommodation: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    image: { type: String, default: "" },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TourTargetModel = mongoose.model<ITourTarget>(
  "TourTarget",
  TourTargetSchema
);
