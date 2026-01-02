"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growSocialMediaPackageUserModel = void 0;
var mongoose_1 = require("mongoose");
var growSocialMediaPackageUserSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        required: true,
    },
    kycURL: {
        type: [String],
        required: true,
    },
    status: {
        type: String,
        enum: ['verificationPending', 'portalActivated', 'verificationRejected'],
        default: 'verificationPending',
    },
    promoCode: {
        type: String,
    },
    userType: {
        type: String,
        enum: ['affiliate', 'package'],
        required: true,
    },
    srkUniversityUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    referredBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'growSocialMediaPackageUser',
    },
    isEmailNotifications: {
        type: Boolean,
        default: null,
    },
    isPushNotifications: {
        type: Boolean,
        default: null,
    },
}, {
    timestamps: true,
});
exports.growSocialMediaPackageUserModel = mongoose_1.default.model('growSocialMediaPackageUser', growSocialMediaPackageUserSchema);
