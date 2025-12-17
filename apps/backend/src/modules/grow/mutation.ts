import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { growContract } from "@srk/shared/contracts";
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
        let growSocialMediaRefferalUser = null;
        if (userData.usedPromoCode) {
            growSocialMediaRefferalUser = await growSocialMediaPackageUserModel.findOne({
                promoCode: userData.usedPromoCode
            });

            if (!growSocialMediaRefferalUser) {
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
        const growUserPromoCode = await AuthService.generateUniquePromoCodeForSrkGrowUser();

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
            referredBy: growSocialMediaRefferalUser ? growSocialMediaRefferalUser._id : null,
        });

        // 5. Create enrollment
        const createSrkGrowPackageEnrollement = await growSocialMediaPackageEnrollmentModel.create({
            growSocialMediaPackageUserId: packageUser._id,
            growSocialMediaPackageId: enrollementData.growSocialMediaPackageId,
            growSocialMediaPackageTypeId: enrollementData.growSocialMediaPackageTypeId,
            growSocialMediaPackageSubTypeId: enrollementData.growSocialMediaPackageSubTypeId,
            profileLinkURL: enrollementData.profileLinkURL,
        });

        // 6. Create payment record
        await growSocialMediaPackagePaymentModel.create({
            growPackageEnrollementId: createSrkGrowPackageEnrollement._id,
            paymentURL: paymentData.paymentURL,
            transactionId: paymentData.transactionId,
            paymentMethod: paymentData.paymentMethod,
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

        const srkGrowUser = await growSocialMediaPackageUserModel.findOne({
            promoCode,
        });

        if (!srkGrowUser) {
            return {
                status: 400,
                body: {
                    success: false,
                    message: "Invalid promo code"
                },
            };
        };

        if (srkGrowUser.status !== 'portalActivated') {
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
            "693bd21b224b9cd931c7cee0": 0.10,
            "693bd21b224b9cd931c7cef2": 0.15,
            "693bd21c224b9cd931c7cf04": 0.20,
        };

        const discountPercentage = packageDiscount[growPackage._id.toString()];
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
                    fullName: srkGrowUser.fullName,
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

const acceptSocialGrowEnrollmentRequest: AppRouteImplementationOrOptions<typeof growContract.acceptSocialGrowEnrollmentRequest> = async ({ params }) => {
    try {
        const enrollmentRequest = await growSocialMediaPackageEnrollmentModel.findById(params.enrollmentId);

        if (!enrollmentRequest) {
            return {
                status: 500,
                body: {
                    message: "No Such Enrollment Found"
                }
            }
        }

        await growSocialMediaPackageUserModel.findOneAndUpdate(
            {
                _id: enrollmentRequest.growSocialMediaPackageUserId
            },
            {
                $set: {
                    status: "portalActivated"
                }
            },
            {
                new: true
            }
        );

        await growSocialMediaPackageEnrollmentModel.findOneAndUpdate(
            {
                _id: params.enrollmentId
            },
            {
                $set: {
                    isActive: true
                }
            }
        );

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


const rejectSocialGrowEnrollmentRequest: AppRouteImplementationOrOptions<typeof growContract.rejectSocialGrowEnrollmentRequest> = async ({ params, body }) => {
    try {
        const enrollementRequest = await growSocialMediaPackageEnrollmentModel.findById(params.enrollmentId);

        if (!enrollementRequest) {
            return {
                status: 500,
                body: {
                    message: "No Such Enrollment Found",
                }
            }
        }

        await growSocialMediaPackageUserModel.findOneAndUpdate(
            { _id: enrollementRequest.growSocialMediaPackageUserId },
            {
                $set: {
                    status: "verificationRejected"
                }
            }
        );

        await growSocialMediaPackagePaymentModel.findOneAndUpdate({
            growPackageEnrollementId: enrollementRequest._id
        },
            {
                $set: {
                    status: "rejected",
                    rejectionReason: body.rejectionReason
                }
            },
        );

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
    acceptSocialGrowEnrollmentRequest,
    rejectSocialGrowEnrollmentRequest,
}