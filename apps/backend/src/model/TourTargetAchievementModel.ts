import mongoose, { Schema, Document } from "mongoose";

export interface ITourTargetAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  tourId: mongoose.Types.ObjectId;
  collectedAmount: number;
  status: "in-progress" | "completed" | "abandoned";
  createdAt: Date;
  updatedAt: Date;
}

const TourTargetAchievementSchema = new Schema<ITourTargetAchievement>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tourId: {
      type: Schema.Types.ObjectId,
      ref: "TourTarget",
      required: true,
    },
    collectedAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

// Create unique index to ensure only one achievement record per user-tour combination
TourTargetAchievementSchema.index({ userId: 1, tourId: 1 }, { unique: true });

export const TourTargetAchievementModel = mongoose.model<ITourTargetAchievement>(
  "TourTargetAchievement",
  TourTargetAchievementSchema
);
