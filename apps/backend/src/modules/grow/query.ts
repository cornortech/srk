import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { growContract } from '@srk/shared/contracts';
import { growSocialMediaPackageUserModel } from '../../model/growSocialMediaPackageUserModel';
import { growSocialMediaPackageEnrollmentModel } from '../../model/growSocialMediaPackageEnrollement';
import { growSocialMediaPackagePaymentModel } from '../../model/growSocialMediaPackagePaymentModel';

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

    // Aggregate with Enrollment and Payment
    const enrollment = await growSocialMediaPackageEnrollmentModel
      .findOne({
        growSocialMediaPackageUserId: profileExist._id,
      })
      .lean();

    let paymentInfo = null;
    if (enrollment) {
      paymentInfo = await growSocialMediaPackagePaymentModel
        .findOne({
          growPackageEnrollementId: enrollment._id,
        })
        .lean();
    }

    return {
      status: 200,
      body: {
        message: 'Profile found',
        result: {
          ...profileExist,
          _id: profileExist._id.toString(),
          kycURL: Array.isArray(profileExist.kycURL)
            ? profileExist.kycURL
            : profileExist.kycURL
            ? [profileExist.kycURL]
            : [],
          transactionId: paymentInfo?.transactionId,
          paymentURL: paymentInfo?.paymentURL,
          paymentMethod: paymentInfo?.paymentMethod,
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
