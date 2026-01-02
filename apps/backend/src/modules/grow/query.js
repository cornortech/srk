"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.growQueryHandler = exports.getSrkGrowProfile = void 0;
var growSocialMediaPackageEnrollment_1 = require("../../model/growSocialMediaPackageEnrollment");
var growPackageTodoModel_1 = require("../../model/growPackageTodoModel");
var growSocialMediaPackagePaymentModel_1 = require("../../model/growSocialMediaPackagePaymentModel");
var growSocialMediaPackageUserModel_1 = require("../../model/growSocialMediaPackageUserModel");
var growSrkAffiliateVerificationModel_1 = require("../../model/growSrkAffiliateVerificationModel");
var growSrkAffiliateEarningPayoutModel_1 = require("../../model/grow/growSrkAffiliateEarningPayoutModel");
var getSrkGrowProfile = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var userId, packageUser, packageEnrollment, packagePayment, _c, engagementPosts, _d, profileLinkURLs, _e, error_1;
    var _f, _g, _h, _j;
    var params = _b.params;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _k.trys.push([0, 12, , 13]);
                userId = params.userId;
                return [4 /*yield*/, growSocialMediaPackageUserModel_1.growSocialMediaPackageUserModel
                        .findById(userId)
                        .populate({
                        path: 'referredBy',
                        select: 'fullName',
                    })];
            case 1:
                packageUser = _k.sent();
                if (!packageUser) {
                    return [2 /*return*/, {
                            status: 404,
                            body: {
                                message: 'User not found',
                            },
                        }];
                }
                return [4 /*yield*/, growSocialMediaPackageEnrollment_1.growSocialMediaPackageEnrollmentModel
                        .findOne({
                        growSocialMediaPackageUserId: packageUser._id,
                    })
                        .populate([
                        {
                            path: 'growSocialMediaPackageId',
                            select: 'name amount',
                        },
                        {
                            path: 'growSocialMediaPackageTypeId',
                            select: 'name',
                        },
                        {
                            path: 'growSocialMediaPackageSubTypeId',
                            select: 'name noOfLikes noOfVideos noOfFollowers',
                        },
                    ])];
            case 2:
                packageEnrollment = _k.sent();
                if (!packageEnrollment) return [3 /*break*/, 4];
                return [4 /*yield*/, growSocialMediaPackagePaymentModel_1.growSocialMediaPackagePaymentModel.findOne({
                        growPackageEnrollmentId: packageEnrollment._id,
                    })];
            case 3:
                _c = _k.sent();
                return [3 /*break*/, 5];
            case 4:
                _c = null;
                _k.label = 5;
            case 5:
                packagePayment = _c;
                if (!packageEnrollment) return [3 /*break*/, 7];
                return [4 /*yield*/, growPackageTodoModel_1.growPackageTodoModel
                        .find({
                        growSocialMediaPackageEnrollmentId: packageEnrollment._id,
                        type: 'like',
                    })
                        .lean()];
            case 6:
                _d = _k.sent();
                return [3 /*break*/, 8];
            case 7:
                _d = null;
                _k.label = 8;
            case 8:
                engagementPosts = _d;
                if (!packageEnrollment) return [3 /*break*/, 10];
                return [4 /*yield*/, growPackageTodoModel_1.growPackageTodoModel.find({
                        growSocialMediaPackageEnrollmentId: packageEnrollment._id,
                        type: 'follow',
                    })];
            case 9:
                _e = _k.sent();
                return [3 /*break*/, 11];
            case 10:
                _e = null;
                _k.label = 11;
            case 11:
                profileLinkURLs = _e;
                return [2 /*return*/, {
                        status: 200,
                        body: {
                            userDetails: {
                                _id: packageUser._id.toString(),
                                srkUniversityId: (_f = packageUser.srkUniversityUserId) === null || _f === void 0 ? void 0 : _f.toString(),
                                fullName: packageUser.fullName,
                                email: packageUser.email,
                                status: packageUser.status,
                                phone: packageUser.phone,
                                kycURL: packageUser.kycURL,
                                country: packageUser.country,
                                gender: packageUser.gender,
                                promoCode: packageUser.promoCode,
                                profileLinkURL: (_g = profileLinkURLs === null || profileLinkURLs === void 0 ? void 0 : profileLinkURLs.map(function (profile) { return profile.profileUrl; })) !== null && _g !== void 0 ? _g : [],
                                userType: packageUser.userType,
                                referredBy: packageUser.referredBy
                                    ? {
                                        name: packageUser.referredBy.fullName,
                                    }
                                    : null,
                                createdAt: packageUser.createdAt.toISOString(),
                            },
                            enrollmentData: packageEnrollment
                                ? {
                                    _id: packageEnrollment._id.toString(),
                                    isActive: packageEnrollment.isActive,
                                    enrollmentPackageDetails: {
                                        name: packageEnrollment.growSocialMediaPackageId.name,
                                        amount: packageEnrollment.growSocialMediaPackageId.amount,
                                        socialMediaPlatform: packageEnrollment.socialMediaPlatform,
                                        packageType: {
                                            name: packageEnrollment.growSocialMediaPackageTypeId.name,
                                            packageSubType: {
                                                name: packageEnrollment.growSocialMediaPackageSubTypeId
                                                    .name,
                                                noOfLikes: packageEnrollment.growSocialMediaPackageSubTypeId
                                                    .noOfLikes,
                                                noOfVideos: packageEnrollment.growSocialMediaPackageSubTypeId
                                                    .noOfVideos,
                                                noOfFollowers: packageEnrollment.growSocialMediaPackageSubTypeId
                                                    .noOfFollowers,
                                            },
                                        },
                                    },
                                    engagementPostURLs: (_h = engagementPosts === null || engagementPosts === void 0 ? void 0 : engagementPosts.map(function (post) { return post.postUrl; })) !== null && _h !== void 0 ? _h : [],
                                    enrollmentPaymentDetails: packagePayment
                                        ? {
                                            paymentUrl: packagePayment.paymentURL,
                                            transactionId: packagePayment.transactionId,
                                            paymentMethod: packagePayment.paymentMethod,
                                            rejectionReason: (_j = packagePayment.rejectionReason) !== null && _j !== void 0 ? _j : null,
                                        }
                                        : null,
                                }
                                : null,
                        },
                    }];
            case 12:
                error_1 = _k.sent();
                console.error(error_1);
                return [2 /*return*/, {
                        status: 500,
                        body: {
                            message: 'Internal server error',
                        },
                    }];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.getSrkGrowProfile = getSrkGrowProfile;
var getAllSrkGrowEnrollmentUser = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var page, limit, queryReq, totalUsers, enrollments, packageEnrollment, error_2;
    var _c, _d;
    var query = _b.query;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 4, , 5]);
                page = Number((_c = query === null || query === void 0 ? void 0 : query.page) !== null && _c !== void 0 ? _c : 1);
                limit = Number((_d = query === null || query === void 0 ? void 0 : query.limit) !== null && _d !== void 0 ? _d : 10);
                queryReq = {};
                return [4 /*yield*/, growSocialMediaPackageEnrollment_1.growSocialMediaPackageEnrollmentModel.countDocuments(queryReq)];
            case 1:
                totalUsers = _e.sent();
                return [4 /*yield*/, growSocialMediaPackageEnrollment_1.growSocialMediaPackageEnrollmentModel
                        .find(queryReq)
                        .skip((page - 1) * limit)
                        .limit(limit)
                        .populate('growSocialMediaPackageUserId')
                        .populate('growSocialMediaPackageId')
                        .populate('growSocialMediaPackageTypeId')
                        .populate('growSocialMediaPackageSubTypeId')
                        .sort({ createdAt: -1 })];
            case 2:
                enrollments = _e.sent();
                return [4 /*yield*/, Promise.all(enrollments.map(function (e) { return __awaiter(void 0, void 0, void 0, function () {
                        var postEngagement, growPackageTodos, profileLinkURLs;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, growPackageTodoModel_1.growPackageTodoModel.find({
                                        growSocialMediaPackageEnrollmentId: e._id,
                                        type: 'like',
                                    })];
                                case 1:
                                    postEngagement = _d.sent();
                                    return [4 /*yield*/, growPackageTodoModel_1.growPackageTodoModel.find({
                                            growSocialMediaPackageEnrollmentId: e._id,
                                            type: 'follow',
                                        })];
                                case 2:
                                    growPackageTodos = _d.sent();
                                    profileLinkURLs = (_a = growPackageTodos === null || growPackageTodos === void 0 ? void 0 : growPackageTodos.map(function (profile) { return profile.profileUrl; })) !== null && _a !== void 0 ? _a : undefined;
                                    return [2 /*return*/, {
                                            _id: e._id.toString(),
                                            userData: {
                                                fullName: e.growSocialMediaPackageUserId.fullName,
                                                email: e.growSocialMediaPackageUserId.email,
                                                gender: e.growSocialMediaPackageUserId.gender,
                                                phoneNumber: e.growSocialMediaPackageUserId.phoneNumber,
                                                country: e.growSocialMediaPackageUserId.country,
                                                kycURL: e.growSocialMediaPackageUserId.kycURL,
                                                usedPromoCode: (_b = e.growSocialMediaPackageUserId.usedPromoCode) !== null && _b !== void 0 ? _b : undefined,
                                                status: e.growSocialMediaPackageUserId.status,
                                            },
                                            enrollmentData: {
                                                growSocialMediaPackageId: e.growSocialMediaPackageId._id.toString(),
                                                growSocialMediaPackageTypeId: e.growSocialMediaPackageTypeId._id.toString(),
                                                growSocialMediaPackageSubTypeId: e.growSocialMediaPackageSubTypeId._id.toString(),
                                                profileLinkURL: profileLinkURLs ? profileLinkURLs : [],
                                                isActive: e.isActive,
                                            },
                                            postEngagement: {
                                                postURLs: (_c = postEngagement === null || postEngagement === void 0 ? void 0 : postEngagement.map(function (post) { return post.postUrl; })) !== null && _c !== void 0 ? _c : [],
                                            },
                                            paymentData: {
                                                paymentMethod: 'esewa',
                                                paymentURL: '',
                                                transactionId: '',
                                                rejectionReason: '',
                                            },
                                            createdAt: e.createdAt,
                                            updatedAt: e.updatedAt,
                                        }];
                            }
                        });
                    }); }))];
            case 3:
                packageEnrollment = _e.sent();
                return [2 /*return*/, {
                        status: 200,
                        body: {
                            data: packageEnrollment,
                            page: page,
                            limit: limit,
                            totalUsers: totalUsers,
                            totalPages: Math.ceil(totalUsers / limit),
                        },
                    }];
            case 4:
                error_2 = _e.sent();
                console.error(error_2);
                return [2 /*return*/, {
                        status: 500,
                        body: {
                            success: false,
                            message: 'Internal server error',
                        },
                    }];
            case 5: return [2 /*return*/];
        }
    });
}); };
var getSrkGrowEnrollmentUserById = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var enrollment, error_3;
    var params = _b.params;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, growSocialMediaPackageEnrollment_1.growSocialMediaPackageEnrollmentModel
                        .findById(params.enrollmentID)
                        .populate('growSocialMediaPackageUserId')
                        .populate('growSocialMediaPackageId')
                        .populate('growSocialMediaPackageTypeId')
                        .populate('growSocialMediaPackageSubTypeId')];
            case 1:
                enrollment = _c.sent();
                if (!enrollment) {
                    return [2 /*return*/, {
                            status: 404,
                            body: {
                                success: false,
                                message: 'Enrollment not found',
                            },
                        }];
                }
                return [2 /*return*/, {
                        status: 200,
                        body: {
                            _id: enrollment._id.toString(),
                            userData: {
                                _id: enrollment.growSocialMediaPackageUserId._id,
                                fullName: enrollment.growSocialMediaPackageUserId.fullName,
                                email: enrollment.growSocialMediaPackageUserId.email,
                                phoneNumber: enrollment.growSocialMediaPackageUserId.phoneNumber,
                                country: enrollment.growSocialMediaPackageUserId.country,
                                gender: enrollment.growSocialMediaPackageUserId.gender,
                                kycURL: enrollment.growSocialMediaPackageUserId.kycURL,
                            },
                            enrollementData: {
                                package: {
                                    _id: enrollment.growSocialMediaPackageId._id,
                                    title: enrollment.growSocialMediaPackageId.title,
                                    price: enrollment.growSocialMediaPackageId.price,
                                },
                                packageType: {
                                    _id: enrollment.growSocialMediaPackageTypeId._id,
                                    title: enrollment.growSocialMediaPackageTypeId.title,
                                },
                                packageSubType: {
                                    _id: enrollment.growSocialMediaPackageSubTypeId._id,
                                    title: enrollment.growSocialMediaPackageSubTypeId.title,
                                },
                                // profileLinkURL: enrollment.profileLinkURL && enrollment.profileLinkURL[0],
                                profileLinkURL: enrollment.profileLinkURL,
                                isActive: enrollment.isActive,
                            },
                            createdAt: enrollment.createdAt,
                            updatedAt: enrollment.updatedAt,
                        },
                    }];
            case 2:
                error_3 = _c.sent();
                console.error(error_3);
                return [2 /*return*/, {
                        status: 500,
                        body: {
                            success: false,
                            message: 'Internal server error',
                        },
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getAllSrkGrowUsers = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var userType, enrollmentFilter, users, userIds, usersLists, error_4;
    var query = _b.query;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                userType = (query || {}).userType;
                enrollmentFilter = {};
                if (!userType) return [3 /*break*/, 2];
                return [4 /*yield*/, growSocialMediaPackageUserModel_1.growSocialMediaPackageUserModel
                        .find({ userType: userType })
                        .select('_id')
                        .lean()];
            case 1:
                users = _c.sent();
                userIds = users.map(function (u) { return u._id; });
                // If no users found, return empty array
                if (userIds.length === 0) {
                    return [2 /*return*/, {
                            status: 200,
                            body: [],
                        }];
                }
                enrollmentFilter = {
                    growSocialMediaPackageUserId: { $in: userIds },
                };
                _c.label = 2;
            case 2: return [4 /*yield*/, growSocialMediaPackageEnrollment_1.growSocialMediaPackageEnrollmentModel
                    .find(enrollmentFilter)
                    .populate({
                    path: 'growSocialMediaPackageUserId',
                    select: 'fullName referredBy status',
                    populate: {
                        path: 'referredBy',
                        select: 'fullName',
                    },
                })
                    .populate({
                    path: 'growSocialMediaPackageId',
                    select: 'name',
                })
                    .sort({ createdAt: -1 })
                    .lean()];
            case 3:
                usersLists = _c.sent();
                return [2 /*return*/, {
                        status: 200,
                        body: usersLists.map(function (u) {
                            var _a, _b;
                            return ({
                                _id: u.growSocialMediaPackageUserId._id.toString(),
                                fullName: u.growSocialMediaPackageUserId.fullName,
                                referredBy: (_b = (_a = u.growSocialMediaPackageUserId.referredBy) === null || _a === void 0 ? void 0 : _a.fullName) !== null && _b !== void 0 ? _b : null,
                                status: u.growSocialMediaPackageUserId.status,
                                socialMediaPackage: {
                                    _id: u.growSocialMediaPackageId._id.toString(),
                                    name: u.growSocialMediaPackageId.name,
                                },
                            });
                        }),
                    }];
            case 4:
                error_4 = _c.sent();
                console.error(error_4);
                return [2 /*return*/, {
                        status: 500,
                        body: {
                            success: false,
                            message: error_4.message
                                ? "Internal server error: ".concat(error_4.message)
                                : 'Internal server error',
                        },
                    }];
            case 5: return [2 /*return*/];
        }
    });
}); };
var getAllSrkGrowAffiliateVerificationRequest = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var page, limit, status_1, filter, totalUsers, totalPages, data, error_5;
    var _c, _d;
    var query = _b.query;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 3, , 4]);
                page = Number((_c = query === null || query === void 0 ? void 0 : query.page) !== null && _c !== void 0 ? _c : 1);
                limit = Number((_d = query === null || query === void 0 ? void 0 : query.limit) !== null && _d !== void 0 ? _d : 10);
                status_1 = query === null || query === void 0 ? void 0 : query.status;
                filter = {};
                if (status_1 === null || status_1 === void 0 ? void 0 : status_1.length) {
                    filter.status = { $in: status_1 };
                }
                return [4 /*yield*/, growSrkAffiliateVerificationModel_1.growSrkAffiliateVerificationModel.countDocuments(filter)];
            case 1:
                totalUsers = _e.sent();
                totalPages = Math.ceil(totalUsers / limit);
                return [4 /*yield*/, growSrkAffiliateVerificationModel_1.growSrkAffiliateVerificationModel
                        .find(filter)
                        .sort({ createdAt: -1 })
                        .skip((page - 1) * limit)
                        .limit(limit)
                        .populate({
                        path: 'srkUniversityUserId',
                        select: '-password',
                    })
                        .lean()];
            case 2:
                data = _e.sent();
                return [2 /*return*/, {
                        status: 200,
                        body: {
                            data: data.map(function (d) { return ({
                                _id: d._id.toString(),
                                username: "".concat(d.srkUniversityUserId.firstName, " ").concat(d.srkUniversityUserId.lastName),
                                email: d.srkUniversityUserId.email,
                                status: d.status,
                                verificationImageUrl: d.verificationImageUrl,
                                verificationRequestId: d._id.toString(),
                                createdAt: d.createdAt.toLocaleString(),
                            }); }),
                            page: page,
                            limit: limit,
                            totalUsers: totalUsers,
                            totalPages: totalPages,
                        },
                    }];
            case 3:
                error_5 = _e.sent();
                console.error(error_5);
                return [2 /*return*/, {
                        status: 500,
                        body: {
                            message: error_5.message
                                ? "Internal server error: ".concat(error_5.message)
                                : 'Internal server error',
                        },
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Affiliate Earning Payout Query Handlers
var getSrkGrowAffiliateEarningPayoutRequestByAdmin = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, page, _d, limit, status_2, pageNum, limitNum, skip, filter, _e, payouts, total, formattedPayouts, error_6;
    var query = _b.query;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 2, , 3]);
                _c = query.page, page = _c === void 0 ? 1 : _c, _d = query.limit, limit = _d === void 0 ? 10 : _d, status_2 = query.status;
                pageNum = Number(page);
                limitNum = Number(limit);
                skip = (pageNum - 1) * limitNum;
                filter = {};
                if (status_2) {
                    filter.status = status_2;
                }
                return [4 /*yield*/, Promise.all([
                        growSrkAffiliateEarningPayoutModel_1.GrowSrkAffiliateEarningPayoutModel.find(filter)
                            .populate({
                            path: 'srkGrowUserId',
                            select: '_id fullName email phoneNumber',
                        })
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limitNum)
                            .lean(),
                        growSrkAffiliateEarningPayoutModel_1.GrowSrkAffiliateEarningPayoutModel.countDocuments(filter),
                    ])];
            case 1:
                _e = _f.sent(), payouts = _e[0], total = _e[1];
                formattedPayouts = payouts.map(function (payout) { return ({
                    _id: payout._id.toString(),
                    srkGrowUser: payout.srkGrowUserId
                        ? {
                            _id: payout.srkGrowUserId._id.toString(),
                            fullName: payout.srkGrowUserId.fullName,
                            email: payout.srkGrowUserId.email,
                            phoneNumber: payout.srkGrowUserId.phoneNumber,
                        }
                        : null,
                    amount: payout.amount,
                    status: payout.status,
                    transactionId: payout.transactionId,
                    paymentUrl: payout.paymentUrl,
                    rejectionReason: payout.rejectionReason,
                    paidAt: payout.paidAt,
                    createdAt: payout.createdAt,
                    updatedAt: payout.updatedAt,
                }); });
                return [2 /*return*/, {
                        status: 200,
                        body: {
                            data: formattedPayouts,
                            pagination: {
                                currentPage: pageNum,
                                totalPages: Math.ceil(total / limitNum),
                                totalItems: total,
                                itemsPerPage: limitNum,
                            },
                        },
                    }];
            case 2:
                error_6 = _f.sent();
                console.error('Error fetching payout requests by admin:', error_6);
                return [2 /*return*/, {
                        status: 500,
                        body: {
                            message: 'Failed to fetch payout requests',
                        },
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getSrkGrowAffiliateEarningPayoutRequestByUser = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var userId, _c, page, _d, limit, pageNum, limitNum, skip, growUser, _e, payouts, total, formattedPayouts, error_7;
    var params = _b.params, query = _b.query;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 3, , 4]);
                userId = params.userId;
                _c = query.page, page = _c === void 0 ? 1 : _c, _d = query.limit, limit = _d === void 0 ? 10 : _d;
                pageNum = Number(page);
                limitNum = Number(limit);
                skip = (pageNum - 1) * limitNum;
                return [4 /*yield*/, growSocialMediaPackageUserModel_1.growSocialMediaPackageUserModel.findById(userId)];
            case 1:
                growUser = _f.sent();
                if (!growUser) {
                    return [2 /*return*/, {
                            status: 404,
                            body: {
                                message: 'User not found',
                            },
                        }];
                }
                return [4 /*yield*/, Promise.all([
                        growSrkAffiliateEarningPayoutModel_1.GrowSrkAffiliateEarningPayoutModel.find({ srkGrowUserId: userId })
                            .populate({
                            path: 'srkGrowUserId',
                            select: '_id fullName email phoneNumber',
                        })
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(limitNum)
                            .lean(),
                        growSrkAffiliateEarningPayoutModel_1.GrowSrkAffiliateEarningPayoutModel.countDocuments({
                            srkGrowUserId: userId,
                        }),
                    ])];
            case 2:
                _e = _f.sent(), payouts = _e[0], total = _e[1];
                formattedPayouts = payouts.map(function (payout) { return ({
                    _id: payout._id.toString(),
                    srkGrowUser: payout.srkGrowUserId
                        ? {
                            _id: payout.srkGrowUserId._id.toString(),
                            fullName: payout.srkGrowUserId.fullName,
                            email: payout.srkGrowUserId.email,
                            phoneNumber: payout.srkGrowUserId.phoneNumber,
                        }
                        : null,
                    amount: payout.amount,
                    status: payout.status,
                    transactionId: payout.transactionId,
                    paymentUrl: payout.paymentUrl,
                    rejectionReason: payout.rejectionReason,
                    paidAt: payout.paidAt,
                    createdAt: payout.createdAt,
                    updatedAt: payout.updatedAt,
                }); });
                return [2 /*return*/, {
                        status: 200,
                        body: {
                            data: formattedPayouts,
                            pagination: {
                                currentPage: pageNum,
                                totalPages: Math.ceil(total / limitNum),
                                totalItems: total,
                                itemsPerPage: limitNum,
                            },
                        },
                    }];
            case 3:
                error_7 = _f.sent();
                console.error('Error fetching payout requests by user:', error_7);
                return [2 /*return*/, {
                        status: 500,
                        body: {
                            message: 'Failed to fetch payout requests',
                        },
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.growQueryHandler = {
    getSrkGrowProfile: exports.getSrkGrowProfile,
    getAllSrkGrowEnrollmentUser: getAllSrkGrowEnrollmentUser,
    getSrkGrowEnrollmentUserById: getSrkGrowEnrollmentUserById,
    getAllSrkGrowUsers: getAllSrkGrowUsers,
    getAllSrkGrowAffiliateVerificationRequest: getAllSrkGrowAffiliateVerificationRequest,
    getSrkGrowAffiliateEarningPayoutRequestByAdmin: getSrkGrowAffiliateEarningPayoutRequestByAdmin,
    getSrkGrowAffiliateEarningPayoutRequestByUser: getSrkGrowAffiliateEarningPayoutRequestByUser,
};
