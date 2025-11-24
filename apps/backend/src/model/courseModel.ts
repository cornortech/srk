import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    package: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CourseModel = mongoose.model("Course", courseSchema);
