import mongoose from "mongoose";

const taskFollowerPackageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        features: {
            type: [String],
            default: []
        },
        price: {
            type: Number,
            required: true
        },
    },
    { timestamps: true }
);


export const taskFollowerPackageModel = mongoose.model("TaskFollowerPackage", taskFollowerPackageSchema);
