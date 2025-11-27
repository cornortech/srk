import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { taskContract } from "../../contract/task/contract";
import { socialTaskPackageModel } from "../../model/socialTaskPackageModel";
import { SocialTaskPackageEnrollmentModel } from "../../model/socialTaskPackageEnrollmentModel";

const getSocialTaskPackage: AppRouteImplementationOrOptions<typeof taskContract.getSocialTaskPackage> = async () => {
    try {
        const allPackages = await socialTaskPackageModel.find()
        return {
            status: 200,
            body: {
                message: "Package Successfully Fetched",
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
                message: "Internal server error",
            },
        };
    }
}

const getAllSocialTaskEnrollment: AppRouteImplementationOrOptions<typeof taskContract.getAllSocialTaskEnrollment> = async () => {
    try {
        const pendingEnrollments = await SocialTaskPackageEnrollmentModel.find({ status: "pending" })
        const approvedEnrollments = await SocialTaskPackageEnrollmentModel.find({ status: "approved" })
        const rejectedEnrollments = await SocialTaskPackageEnrollmentModel.find({ status: "rejected" })
        return {
            status: 200,
            body: {
                message: "Enrollements fetched by status",
                pendingEnrollments: pendingEnrollments,
                approvedEnrollments: approvedEnrollments,
                rejectedEnrollments: rejectedEnrollments,
                success: true
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


export const taskQueryHandler = {getSocialTaskPackage, getAllSocialTaskEnrollment}
