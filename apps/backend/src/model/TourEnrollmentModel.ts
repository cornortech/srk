import mongoose, { Schema, Types } from "mongoose";

export interface ITourEnrollment extends Document {
  userId: Types.ObjectId;
  tourId: Types.ObjectId;
  enrolledAt: Date;
  status: "enrolled" | "completed" | "cancelled";
}

const TourEnrollmentSchema = new Schema<ITourEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tourId: { type: Schema.Types.ObjectId, ref: "TourTarget", required: true },
    enrolledAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["enrolled", "completed", "cancelled"],
      default: "enrolled",
    },
  },
  { timestamps: true }
);

export const TourEnrollmentModel = mongoose.model<ITourEnrollment>(
  "TourEnrollment",
  TourEnrollmentSchema
);
