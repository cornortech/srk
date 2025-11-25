import mongoose from "mongoose"

const taskDoerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "taskcreators",
        required: true
    },
    proofScreenshot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
        required: true
    },
    remarks: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const TaskDoerModel =  mongoose.model("TaskDoer", taskDoerSchema)
