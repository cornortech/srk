import { srkTaskContract } from "@srk/shared/contracts";
import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { srkTasksEarningsPayoutModel } from "../../../model/task/srkTasksEarningsPayoutModel";

const acceptSrkTaskUserEarningsPayout: AppRouteImplementationOrOptions<
    typeof srkTaskContract.acceptSrkTaskUserEarningsPayout
> = async ({ params, body }) => {
    try {

        const srkTaskUserPayoutExists =
            await srkTasksEarningsPayoutModel.findById(params.payoutId);

        if (!srkTaskUserPayoutExists) {
            return {
                status: 400,
                body: {
                    success: false,
                    message: 'Task Earning Payout does not exist',
                },
            };
        }

        if (srkTaskUserPayoutExists.status !== 'pending') {
            return {
                status: 400,
                body: {
                    success: false,
                    message: `Payout already ${srkTaskUserPayoutExists.status}`,
                },
            };
        }

        srkTaskUserPayoutExists.status = 'approved';
        srkTaskUserPayoutExists.transactionId = body.transactionId;
        srkTaskUserPayoutExists.paymentScreenshotUrl = body.paymentScreenshotUrl;

        await srkTaskUserPayoutExists.save();

        return {
            status: 200,
            body: {
                success: true,
                message: 'Task Payout accepted successfully',
            },
        };
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            body: {
                success: false,
                message: error.message
                    ? `Internal server error: ${error.message}`
                    : 'Internal server error',
            },
        }
    }
};

const rejectSrkTaskUserEarningsPayout: AppRouteImplementationOrOptions<
    typeof srkTaskContract.rejectSrkTaskUserEarningsPayout
> = async ({ params, body }) => {
    try {
        const srkTaksUserEarningPayoutExists =
            await srkTasksEarningsPayoutModel.findById(params.payoutId);

        if (!srkTaksUserEarningPayoutExists) {
            return {
                status: 400,
                body: {
                    success: false,
                    message: 'Affiliate Earning Payout does not exist',
                },
            };
        }

        if (srkTaksUserEarningPayoutExists.status !== 'pending') {
            return {
                status: 400,
                body: {
                    success: false,
                    message: `Payout already ${srkTaksUserEarningPayoutExists.status}`,
                },
            };
        }

        srkTaksUserEarningPayoutExists.status = 'rejected';
        srkTaksUserEarningPayoutExists.rejectionReason = body.rejectionReason;

        await srkTaksUserEarningPayoutExists.save();

        return {
            status: 200,
            body: {
                success: true,
                message: 'Task Payout rejected successfully',
            },
        };
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            body: {
                success: false,
                message: error.message
                    ? `Internal server error: ${error.message}`
                    : 'Internal server error',
            },
        }
    }
};

export const srkTaskMutationHandler = {
    acceptSrkTaskUserEarningsPayout,
    rejectSrkTaskUserEarningsPayout,
}