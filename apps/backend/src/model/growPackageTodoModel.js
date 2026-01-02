"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growPackageTodoModel = void 0;
var mongoose_1 = require("mongoose");
var growPackageTodoSchema = new mongoose_1.default.Schema({
    growSocialMediaPackageEnrollmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'growSocialMediaPackageEnrollment',
        required: true,
    },
    postUrl: { type: String, required: true },
    profileUrl: { type: String, required: true },
    type: {
        type: String,
        enum: ['follow', 'like'],
        required: true,
    },
    platform: {
        type: String,
        enum: ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Facebook'],
        required: true,
    },
    followCounts: { type: Number, default: 0 },
    likeCounts: { type: Number, default: 0 },
}, {
    timestamps: true,
});
exports.growPackageTodoModel = mongoose_1.default.model('growPackageTodo', growPackageTodoSchema);
