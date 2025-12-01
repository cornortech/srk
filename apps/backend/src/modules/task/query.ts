import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { taskContract } from "../../contract/task/contract";
import { SocialTaskPackageModel } from "../../model/socialTaskPackageModel";
import { SocialTaskPackageEnrollmentModel } from "../../model/socialTaskPackageEnrollmentModel";
import { SocialTaskEarningStatementModel } from "../../model/socialTaskEarningStatementModel";

const getSocialTaskPackages: AppRouteImplementationOrOptions<typeof taskContract.getSocialTaskPackages> = async () => {
    try {
        const allPackages = await SocialTaskPackageModel.find()

        return {
            status: 200,
            body: {
                result: allPackages,
                success: true
            }
        }

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            body: {
                success: false,
                message: error.message ? `Internal sever error: ${error.message}` : "Internal server error",
            },
        }
    }
}

const getAllSocialTaskEnrollments: AppRouteImplementationOrOptions<typeof taskContract.getAllSocialTaskEnrollments> = async ({query}) => {
    try {
        const enrollments = await SocialTaskPackageEnrollmentModel.find({ status: query.status })

        return {
            status: 200,
            body: {
                result: enrollments,
                success: true
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

// const getAllActiveSocialLinksToFollow: AppRouteImplementationOrOptions<typeof taskContract.getAllActiveSocialLinksToFollow> = async()=>{
//     try{

//     }catch(error){
//         console.log(error)
//         return{
//             status: 500,
//             body:{
//                 message: "Internal server error",
//                 success: false
//             }
//         }
//     }
// }

const getSocialTaskEarning: AppRouteImplementationOrOptions<typeof taskContract.getSocialTaskEarning> = async ({ params }) => {
    try {
        const earningExist = await SocialTaskEarningStatementModel.findOne({ followedBy: params.id })

        if (!earningExist) {
            return {
                status: 500,
                body: {
                    message: "Earnings not found",
                    success: false
                }
            }
        }

        return {
            status: 200,
            body: {
                message: "Earning",
                result: earningExist,
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
export const taskQueryHandler = { getSocialTaskPackages, getAllSocialTaskEnrollments, getSocialTaskEarning }
