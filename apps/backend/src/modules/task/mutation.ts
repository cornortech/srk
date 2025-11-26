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

export const taskMutationHandler = { createSocialTaskPackage, enrollSocialTaskPackage }
