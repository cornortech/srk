import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { taskContract } from "../../contract/task/contract";
import { SocialTaskPackageModel } from "../../model/socialTaskPackageModel";
import { SocialTaskPackageEnrollmentModel } from "../../model/socialTaskPackageEnrollmentModel";
import { SocialTaskLinkModel } from "../../model/socialTaskLinkModel";
import { UserModel } from "../../model/userModel";
import { SocialTaskFollowRequestModel } from "../../model/socialTaskFollowRequestModel";
import { SocialTaskEarningStatementModel } from "../../model/socialTaskEarningStatementModel";

const createSocialTaskPackage: AppRouteImplementationOrOptions<typeof taskContract.createSocialTaskPackage> = async ({ body }) => {
    try {
        await SocialTaskPackageModel.create({
            name: body.name,
            features: body.features,
            totalNumberOfFollowers: body.totalNumberOfFollowers,
            isPopular: body.isPopular,
            price: body.price
        })

        return {
            status: 201,
            body: {
                message: "Package Successfully Created",
                success: true
            }
        }

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            body: {
                success: false,
                message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
            },
        };
    }
}

const enrollSocialTaskPackage: AppRouteImplementationOrOptions<typeof taskContract.enrollSocialTaskPackage> = async ({ body }) => {
    try {
        const userExist = await UserModel.findOne({ _id: body.userId })

        if (!userExist) {
            return {
                status: 500,
                body: {
                    message: "User not found",
                    success: false
                }
            }
        }

        const socialTaskPackage = await SocialTaskPackageModel.findOne({ _id: body.socialTaskPackage })

        if (!socialTaskPackage) {
            return {
                status: 500,
                body: {
                    message: "No Such Package Found",
                    success: false
                }
            }
        }

        await SocialTaskPackageEnrollmentModel.create({
            userId: body.userId,
            socialTaskPackage: body.socialTaskPackage,
            paymentScreenshotUrl: body.paymentScreenshotUrl,
            expirationDate: body.expirationDate,
            isExpired: body.isExpired
        })

        return {
            status: 201,
            body: {
                message: "Enrolled Successfully",
                success: true
            }
        }

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            body: {
                success: false,
                message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
            },
        };
    }
}

const acceptTaskEnrollmentRequest: AppRouteImplementationOrOptions<typeof taskContract.acceptTaskEnrollmentRequest> = async ({ params }) => {
    try {
        const enrollmentRequest = await SocialTaskPackageEnrollmentModel.findOne({ _id: params.id })

        if (!enrollmentRequest) {
            return {
                status: 500,
                body: {
                    message: "No Such Enrollment Found"
                }
            }
        }

        await SocialTaskPackageEnrollmentModel.findOneAndUpdate(
            { _id: params.id },
            { $set: { status: "approved" } },
            { new: true }
        )

        return {
            status: 200,
            body: {
                message: "Enrollment Request Approved",
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

const rejectTaskEnrollmentRequest: AppRouteImplementationOrOptions<typeof taskContract.rejectTaskEnrollmentRequest> = async ({ params, body }) => {
    try {
        const enrollmentRequest = await SocialTaskPackageEnrollmentModel.findOne({ _id: params.id })

        if (!enrollmentRequest) {
            return {
                status: 404,
                body: {
                    message: "No Such Enrollment Found"
                }
            }
        }

        await SocialTaskPackageEnrollmentModel.findOneAndUpdate(
            { _id: params.id },
            { $set: { status: "rejected", rejectionReason: body.rejectionReason } }
        )

        return {
            status: 201,
            body: {
                message: "Enrollment Request Rejected",
                success: false
            }
        }

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            body: {
                message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
                success: false
            }
        }
    }

}

const createSocialLinks: AppRouteImplementationOrOptions<typeof taskContract.createSocialLinks> = async ({ body }) => {
    try {
        const userExist = await UserModel.findOne({ _id: body.userId })

        if (!userExist) {
            return {
                status: 500,
                body: {
                    message: "User not found",
                    success: false
                }
            }
        }

        const result = await SocialTaskLinkModel.create({
            userId: body.userId,
            facebookUrl: body.facebookurl,
            instagramUrl: body.instagramUrl,
            tiktokUrl: body.tiktokUrl,
            youtubeUrl: body.youtubeUrl
        })

        return {
            status: 201,
            body: {
                message: "Links added successfully",
                result: result,
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

const createSocialTaskFollowRequest: AppRouteImplementationOrOptions<typeof taskContract.createSocialTaskFollowRequest> = async ({ params, body }) => {
    try {
        const requestExist = await SocialTaskLinkModel.findOne({ _id: params.id })

        if (!requestExist) {
            return {
                status: 500,
                body: {
                    message: "No request id found",
                    success: false
                }
            }
        }

        await SocialTaskFollowRequestModel.create({
            followedBy: body.followedBy,
            followedTo: body.followedTo,
            socialMedia: body.socialMedia,
            screenshotUrl: body.screenshotUrl,
        })

        return {
            status: 201,
            body: {
                message: "Requested successfully",
                success: true
            }
        }

    } catch (error) {
        console.log(error)
        return {
            status: 500,
            body: {
                message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
                success: false
            }
        }
    }
}

const approveSocialTaskFollowRequest: AppRouteImplementationOrOptions<typeof taskContract.approveSocialTaskFollowRequest> = async ({ params }) => {
    try {
        const requestExist = await SocialTaskFollowRequestModel.findOne({ _id: params.id })

        if (!requestExist) {
            return {
                status: 500,
                body: {
                    message: "Request not found",
                    success: false
                }
            }
        }

        await SocialTaskFollowRequestModel.findOneAndUpdate(
            { _id: params.id },
            { $set: { status: "approved" } }
        )

        await SocialTaskEarningStatementModel.create({
            followedBy: requestExist.followedBy,
            followedTo: requestExist.followedTo,
            amount: 50
        })

        return {
            status: 201,
            body: {
                message: "Request Approved",
                success: false
            }
        }

    } catch (error) {
        console.log(error)
        return {
            status: 500,
            body: {
                message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
                success: false
            }
        }
    }
}

const rejectSocialTaskFollowRequest: AppRouteImplementationOrOptions<typeof taskContract.rejectSocialTaskFollowRequest> = async ({ params, body }) => {
    try {
        const requestExist = await SocialTaskFollowRequestModel.findOne({ _id: params.id })

        if (!requestExist) {
            return {
                status: 500,
                body: {
                    message: "Request not found",
                    success: false
                }
            }
        }

        await SocialTaskFollowRequestModel.findOneAndUpdate(
            { _id: params.id },
            { $set: { status: "rejected", rejectionReason: body.rejectionReason } }
        )

        return {
            status: 201,
            body: {
                message: "Request Rejected",
                success: false
            }
        }

    } catch (error) {
        console.log(error)
        return {
            status: 500,
            body: {
                message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
                success: false
            }
        }
    }
}

export const taskMutationHandler = { createSocialTaskPackage, enrollSocialTaskPackage, acceptTaskEnrollmentRequest, rejectTaskEnrollmentRequest, createSocialLinks, createSocialTaskFollowRequest, approveSocialTaskFollowRequest, rejectSocialTaskFollowRequest }
