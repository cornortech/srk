import mongoose from "mongoose";

const taskFollowerPackageEnrollmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },

        taskFollowerPackage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TaskFollowerPackage",
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        rejectionReason: {
            type: String,
            default: ""
        },
    },
    { timestamps: true }
);

export const taskFollowerPackageEnrollmentSchemaModel = mongoose.model("TaskFollowerPackageEnrollment", taskFollowerPackageEnrollmentSchema);
