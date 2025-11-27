import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { taskContract } from "../../contract/task/contract";
import { socialTaskPackageModel } from "../../model/socialTaskPackageModel";
import { SocialTaskPackageEnrollmentModel } from "../../model/socialTaskPackageEnrollmentModel";
import { SocialTaskLinkModel } from "../../model/socialTaskLinkModel";
import { UserModel } from "../../model/userModel";

const createSocialTaskPackage: AppRouteImplementationOrOptions<typeof taskContract.createSocialTaskPackage> = async ({ body }) => {
    try {
        await socialTaskPackageModel.create({
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
                message: "Internal server error",
            },
        };
    }
}

const enrollSocialTaskPackage: AppRouteImplementationOrOptions<typeof taskContract.enrollSocialTaskPackage> = async ({ body }) => {
    try {
        const socialTaskPackage = await socialTaskPackageModel.findOne({ _id: body.socialTaskPackage })
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
            status: body.status,
            remarks: body.remarks,
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
                message: "Internal server error",
            },
        };
    }
}

const acceptTaskEnrollmentRequest: AppRouteImplementationOrOptions<typeof taskContract.acceptTaskEnrollmentRequest> = async ({ params, body }) => {
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
            { $set: { status: "approved", remarks: body.remarks } },
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
                message: "Internal server error",
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
                status: 500,
                body: {
                    message: "No Such Enrollment Found"
                }
            }
        }
        await SocialTaskPackageEnrollmentModel.findOneAndUpdate(
            { _id: params.id },
            { $set: { status: "rejected", remarks: body.remarks } }
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
                message: "Internal server error",
                success: false
            }
        }
    }

}

const createSocialLinks: AppRouteImplementationOrOptions<typeof taskContract.createSocialLinks> = async ({ body }) => {
    try {
        const user = await UserModel.findOne({ _id: body.userId })
        if (!user) {
            return {
                status: 500,
                body: {
                    message: "User not found",
                    success: false
                }
            }
        }
        await SocialTaskLinkModel.create({
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
                success: true
            }
        }

    } catch (error) {
        console.log(error);
        return ({
            status: 500,
            body: {
                message: "Internal server error",
                success: false
            }
        })
    }
}
export const taskMutationHandler = { createSocialTaskPackage, enrollSocialTaskPackage, acceptTaskEnrollmentRequest, rejectTaskEnrollmentRequest, createSocialLinks }
