import { growAffiliateContract } from "@srk/shared/contracts";
import { AppRouteImplementation } from "@ts-rest/express/src/lib/types";
import { affiliateRequestModel } from "../../../model/affiliateRequestModel";
import { UserModel } from "../../../model/userModel";
import { EarningStatementModel } from "../../../model/earningStatementModel";

const getGrowAffiliateUser: AppRouteImplementation<typeof growAffiliateContract.getGrowAffiliateUser> = async ({params}) => {
    try {
        const affiliateUserExist = await affiliateRequestModel.findOne({_id: params.id})
        
        if (!affiliateUserExist) {
            return {
                status: 404,
                body: {
                    success: false,
                    message: "Affiliate user not found",
                },
            }
        }

        // Fetch user details
        const userDetails = await UserModel.findOne({_id: affiliateUserExist.userId})
        
        // Fetch wallet balance from earning statement
        const earningData = await EarningStatementModel.findOne({userId: affiliateUserExist.userId}).sort({createdAt: -1})

        return {
            status: 200,
            body: {
                success: true,
                data: {
                    id: affiliateUserExist._id,
                    user: {
                        id: userDetails?._id,
                        firstName: userDetails?.firstName,
                        lastName: userDetails?.lastName,
                        email: userDetails?.email,
                        phoneNumber: userDetails?.phoneNumber,
                    },
                    walletBalance: earningData?.balanceWallet || 0,
                    status: affiliateUserExist.status,
                    requestedAt: affiliateUserExist.requestedAt,
                },
            },
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            body: {
                success: false,
                message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
            },
        }
    }
}

export const growAffiliateQueryHandler = { getGrowAffiliateUser }
