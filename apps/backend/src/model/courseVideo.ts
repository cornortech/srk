import mongoose from "mongoose";

const courseVideoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    duration: {
      type: Number, //in seconds
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CourseVideoModel = mongoose.model(
  "CourseVideo",
  courseVideoSchema
);
