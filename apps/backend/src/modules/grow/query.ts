import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { growContract } from '@srk/shared/contracts';
import { growSocialMediaPackageUserModel } from '../../model/growSocialMediaPackageUserModel';

const getSrkGrowProfile: AppRouteImplementationOrOptions<
  typeof growContract.getSrkGrowProfile
> = async ({ params }) => {
  try {
    const profileExist = await growSocialMediaPackageUserModel
      .findOne({ _id: params.id })
      .lean();

    if (!profileExist) {
      return {
        status: 404,
        body: {
          message: 'Profile not found',
          success: false,
        },
      };
    }

    return {
      status: 200,
      body: {
        message: 'Profile found',
        result: {
          ...profileExist,
          _id: profileExist._id.toString(),
        },
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message
          ? `Internal sever error: ${error.message}`
          : 'Internal server error',
      },
    };
  }
};

export const growQueryHandler = { getSrkGrowProfile };
