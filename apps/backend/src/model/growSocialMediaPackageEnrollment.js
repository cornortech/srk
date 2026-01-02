"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growSocialMediaPackageEnrollmentModel = void 0;
var mongoose_1 = require("mongoose");
var growSocialMediaPackageEnrollmentSchema = new mongoose_1.default.Schema({
    growSocialMediaPackageUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'growSocialMediaPackageUser',
        required: true,
    },
    growSocialMediaPackageId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'growSocialMediaPackage',
        required: true,
    },
    growSocialMediaPackageTypeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'growSocialMediaPackageType',
        required: true,
    },
    growSocialMediaPackageSubTypeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'growSocialMediaPackageSubType',
        required: true,
    },
    type: {
        type: String,
        enum: ['follow', 'like'],
        required: true,
    },
    socialMediaPlatform: {
        type: String,
        enum: ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Facebook'],
        required: true,
    },
    profileLinkURL: {
        type: [String],
    },
    amount: {
        type: Number,
        requred: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.growSocialMediaPackageEnrollmentModel = mongoose_1.default.model('growSocialMediaPackageEnrollment', growSocialMediaPackageEnrollmentSchema);
