import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types"
import { growContract } from "../../contract/grow/contract"
import { growSocialMediaPackageUserModel } from "../../model/growSocialMediaPackageUserModel"
import { parseArgs } from "util"

// const createGrowSocialMediaEnrollement:AppRouteImplementation<
// typeof growContract.createGrowSocialMediaEnrollement
// > = async ({ req, body }) => {
//     try {

//         const {
//             fullName,
//             email,
//             phoneNumber,
//             socialMediaPlatform,
//             profileLink,
//             packageId,
//         } = req.body;

//     } catch (error) {
//         console.error("Error creating grow social media enrollement:", error);
//         return {
//             status: 500,
//             body: {
//                 success: false,
//                 message: "Internal server error",
//             },
//         };
//     }
// }

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

export const growMutationHandler = { acceptSocialGrowFollowRequest, rejectSocialGrowFollowRequest }
