import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { growContract } from "../../contract/grow/contract";
import { growSocialMediaPackageUserModel } from "../../model/growSocialMediaPackageUserModel";
import { growSocialMediaPackageModel } from "../../model/growSocialMediaPackageModel";
import { growSocialMediaPackageTypeModel } from "../../model/growSocialMediaPackageTypeModel";
import { growSocialMediaPackageSubTypeModel } from "../../model/growSocialMediaPackageSubTypeModel";
import { growSocialMediaPackageEnrollmentModel } from "../../model/growSocialMediaPackageEnrollement";
import { growSocialMediaPackagePaymentModel } from "../../model/growSocialMediaPackagePaymentModel";
import AuthService from "../../services/authService";

const createGrowSocialMediaEnrollement: AppRouteImplementationOrOptions<
    typeof growContract.createGrowSocialMediaEnrollement
> = async ({ body }) => {
    try {

        const {
            userData,
            enrollementData,
            paymentData
        } = body;

        // 1. Validate promo code and find referredBy user using promocode
        let referral = null;
        if (userData.promoCode) {
            referral = await growSocialMediaPackageUserModel.findOne({
                promoCode: userData.promoCode
            });

            if (!referral) {
                return {
                    status: 400,
                    body: {
                        success: false,
                        message: "Invalid promo code"
                    },
                };
            };
        }

        // 2. Validate Package, Type, SubType
        const packageExists = await growSocialMediaPackageModel.findById(enrollementData.growSocialMediaPackageId);
        if (!packageExists) {
            return {
                status: 400,
                body: {
                    success: false,
                    message: "Package not found"
                },
            };
        };

        const packageTypeExists = await growSocialMediaPackageTypeModel.findById(enrollementData.growSocialMediaPackageTypeId);
        if (!packageTypeExists || String(packageTypeExists.growSocialMediaPackageId) !== enrollementData.growSocialMediaPackageId) {
            return {
                status: 400,
                body: {
                    success: false,
                    message: "Package type invalid or does not belong to package"
                },
            };
        }

        const packageSubTypeExists = await growSocialMediaPackageSubTypeModel.findById(enrollementData.growSocialMediaPackageSubTypeId);
        if (!packageSubTypeExists || String(packageSubTypeExists.growSocialMediaPackageTypeId) !== enrollementData.growSocialMediaPackageTypeId) {
            return {
                status: 400,
                body: {
                    success: false,
                    message: "Package sub-type invalid or does not belong to package type"
                },
            };
        }

        // 3. Check duplicate enrollment (active)
        const existingPackageEnrollment = await growSocialMediaPackageEnrollmentModel.findOne({
            "growSocialMediaPackageUserId.email": userData.email,
            isActive: true,
        });

        if (existingPackageEnrollment) {
            return {
                status: 409,
                body: {
                    success: false,
                    message: "User already has an active enrollment"
                },
            };
        }

        // 4. Create user
        const hashedPassword = await AuthService.hashPassword(userData.password);

        // Generate a unique promo code for the new user
        const growUserPromoCode = await AuthService.generateUniqueReferralCode();

        const packageUser = await growSocialMediaPackageUserModel.create({
            fullName: userData.fullName,
            email: userData.email,
            password: hashedPassword,
            gender: userData.gender,
            phone: userData.phoneNumber,
            country: userData.country,
            kycURL: userData.kycURL,
            status: "verificationPending",
            promoCode: growUserPromoCode,
            referredBy: referral ? referral._id : null,
        });

        // 5. Create enrollment
        await growSocialMediaPackageEnrollmentModel.create({
            growSocialMediaPackageUserId: packageUser._id,
            growSocialMediaPackageId: enrollementData.growSocialMediaPackageId,
            growSocialMediaPackageTypeId: enrollementData.growSocialMediaPackageTypeId,
            growSocialMediaPackageSubTypeId: enrollementData.growSocialMediaPackageSubTypeId,
            profileLinkURL: enrollementData.profileLinkURL,
            isActive: enrollementData.isActive || false,
        });

        // 6. Create payment record
        await growSocialMediaPackagePaymentModel.create({
            growPackageEnrollementId: paymentData.growPackageEnrollementId,
            paymentURL: paymentData.paymentURL,
            transactionId: paymentData.transactionId,
            paymentMethod: paymentData.paymentMethod,
            status: "pending",
        });

        return {
            status: 201,
            body: {
                success: true,
                message: "Enrollment submitted successfully",
            }
        }

    } catch (error) {
        console.error("Error creating grow social media enrollement:", error);
        return {
            status: 500,
            body: {
                success: false,
                message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
            },
        };
    }
};

export const validateGrowUserPromoCode: AppRouteImplementationOrOptions<
    typeof growContract.validateGrowUserPromoCode
> = async ({ body }) => {
    try {
        const {
            promoCode,
            growSocialMediaPackageId,
        } = body;

        const validPromoCode = await growSocialMediaPackageUserModel.findOne({
            promoCode
        });

        if (!validPromoCode) {
            return {
                status: 400,
                body: {
                    success: false,
                    message: "Invalid promo code"
                },
            };
        };

        if (validPromoCode.status !== 'portalActivated') {
            return {
                status: 400,
                body: {
                    success: false,
                    message: "Promo code owner is not active or eligible"
                },
            };
        }

        const growPackage = await growSocialMediaPackageModel.findById(growSocialMediaPackageId);
        if (!growPackage) {
            return {
                status: 400,
                body: {
                    success: false,
                    message: "Package not found"
                }
            };
        }

        const packageDiscount: Record<string, number> = {
            starter: 0.10,
            intermediate: 0.15,
            pro: 0.20,
        };

        const discountPercentage = packageDiscount[growPackage.name.toLowerCase()] || 0;
        const originalAmount = growPackage.amount;
        const discountAmount = originalAmount * discountPercentage;
        const finalAmountAfterDiscount = originalAmount - discountAmount;

        return {
            status: 200,
            body: {
                success: true,
                message: `Promo code valid! You get a discount of ${discountPercentage * 100}% on the ${growPackage.name} package.`,
                discountDetails: {
                    originalAmount,
                    discountPercentage: discountPercentage * 100,
                    discountAmount,
                    finalAmountAfterDiscount,
                },
            }
        };

    } catch (error) {
        console.error("Error validating promo code:", error);
        return {
            status: 500,
            body: {
                success: false,
                message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
            },
        }
    };
};

const acceptSocialGrowFollowRequest: AppRouteImplementationOrOptions<typeof growContract.acceptSocialGrowFollowRequest> = async ({ params }) => {
    try {
        const enrollmentRequest = await growSocialMediaPackageUserModel.findOne({ _id: params.id })

        if (!enrollmentRequest) {
            return {
                status: 500,
                body: {
                    message: "No Such Enrollment Found"
                }
            }
        }

        await growSocialMediaPackageUserModel.findOneAndUpdate(
            { _id: params.id },
            { $set: { status: "portalActivated" } },
            { new: true }
        )

        return {
            status: 200,
            body: {
                message: "Follow Request Approved",
                success: true
            }
        }

    } catch (error) {
        console.log(error);
        return ({
            status: 500,
            body: {
                message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
                success: false
            }
        })
    }
}


const rejectSocialGrowFollowRequest: AppRouteImplementationOrOptions<typeof growContract.rejectSocialGrowFollowRequest> = async ({ params, body }) => {
    try {
        const enrollementRequest = await growSocialMediaPackageUserModel.findOne({ _id: params.id })

        if (!enrollementRequest) {
            return {
                status: 500,
                body: {
                    message: "No Such Enrollment Found",
                }
            }
        }

        await growSocialMediaPackageUserModel.findOneAndUpdate(
            { _id: params.id },
            { $set: { status: "verificationRejected", rejectionReason: body.rejectionReason } }
        )

        return {
            status: 200,
            body: {
                message: "Follow Request Rejected",
                success: false
            }
        }
    } catch (error) {
        console.log(error)
        return ({
            status: 500,
            body: {
                message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
                success: false
            }
        })
    }
}

export const growMutationHandler = {
    createGrowSocialMediaEnrollement,
    validateGrowUserPromoCode,
    acceptSocialGrowFollowRequest,
    rejectSocialGrowFollowRequest,
}