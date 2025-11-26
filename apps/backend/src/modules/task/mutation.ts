import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { taskContract } from "../../contract/task/contract";
import { socialTaskPackageModel } from "../../model/socialTaskPackageModel";
import { SocialTaskPackageEnrollmentModel } from "../../model/socialTaskPackageEnrollmentModel";

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
        await SocialTaskPackageEnrollmentModel.create({
            userId: body.userId,
            socialTaskPackage: body.socialTaskPackage,
            status: body.status,
            rejectionReason: body.rejectionReason,
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

const acceptTaskEnrollmentRequest: AppRouteImplementationOrOptions<typeof taskContract.acceptTaskEnrollmentRequest> = async ({ params }) => {
    try {
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
                message: "Internal server error",
                success: false
            }
        })
    }
}

const rejectTaskEnrollmentRequest: AppRouteImplementationOrOptions<typeof taskContract.rejectTaskEnrollmentRequest> = async ({ params, body }) => {
    try {
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
                message: "Internal server error",
                success: false
            }
        }
    }

}
export const taskMutationHandler = { createSocialTaskPackage, enrollSocialTaskPackage, acceptTaskEnrollmentRequest, rejectTaskEnrollmentRequest }
