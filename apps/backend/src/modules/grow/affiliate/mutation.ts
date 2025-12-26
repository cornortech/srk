import { growAffiliateContract } from '@srk/shared/contracts';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { growSrkAffiliateUserEarningsPayoutModel } from '../../../model/grow/growSrkAffiliateUserEarningsPayoutModel';
import { growSocialMediaPackageUserModel } from '../../../model/growSocialMediaPackageUserModel';

const createSrkAffiliateEarningPayout: AppRouteImplementationOrOptions<
  typeof growAffiliateContract.createSrkAffiliateEarningPayout
> = async ({ body }) => {
  try {
    const growSrkUserExist = await growSocialMediaPackageUserModel.findOne({
      growSocialMediaPackageUserId: body.growSocialMediaPackageUserId,
    });

    if (!growSrkUserExist) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'User does not exist',
        },
      };
    }

    await growSrkAffiliateUserEarningsPayoutModel.create({
      growSocialMediaPackageUserId: body.growSocialMediaPackageUserId,
      status: 'requested',
      amount: body.amount,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Payout created successfully',
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const acceptSrkAffiliateEarningPayout: AppRouteImplementationOrOptions<
  typeof growAffiliateContract.acceptSrkAffiliateEarningPayout
> = async ({ params, body }) => {
  try {
    const growSrkAffiliatePayoutExist =
      await growSrkAffiliateUserEarningsPayoutModel.findById(params.payoutId);

    if (!growSrkAffiliatePayoutExist) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Affiliate Earning Payout does not exist',
        },
      };
    }

    growSrkAffiliatePayoutExist.status = 'approved';
    growSrkAffiliatePayoutExist.transactionId = body.transactionId;
    growSrkAffiliatePayoutExist.paymentScreenshot = body.paymentScreenshot;

    await growSrkAffiliatePayoutExist.save();

    return {
      status: 200,
      body: {
        success: true,
        message: 'Payout accepted successfully',
      },
    };
  } catch (error) {
    console.error(error);

    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const rejectSrkAffiliateEarningPayout: AppRouteImplementationOrOptions<
  typeof growAffiliateContract.rejectSrkAffiliateEarningPayout
> = async ({ body }) => {
  try {
    // Implement the logic to reject a payout for SRK affiliate earnings
    // You can access the request body using 'body' parameter

    const growSrkAffiliatePayoutExist =
      await growSrkAffiliateUserEarningsPayoutModel.findById(body.payoutId);

    if (!growSrkAffiliatePayoutExist) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Affiliate Earning Payout does not exist',
        },
      };
    }

    growSrkAffiliatePayoutExist.status = 'rejected';
    growSrkAffiliatePayoutExist.rejectionReason = body.rejectionReason;

    await growSrkAffiliatePayoutExist.save();

    return {
      status: 200,
      body: {
        success: true,
        message: 'Payout rejected successfully',
      },
    };
  } catch (error) {
    console.error(error);

    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

export const growAffiliateMutationHandler = {
  createSrkAffiliateEarningPayout,
  acceptSrkAffiliateEarningPayout,
  rejectSrkAffiliateEarningPayout,
};
