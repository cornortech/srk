import { Types } from 'mongoose';
import { growContract } from '@srk/shared/contracts';
import { growSocialMediaPackageUserModel } from '../../model/growSocialMediaPackageUserModel';
import { growSocialMediaPackageModel } from '../../model/growSocialMediaPackageModel';
import { growSocialMediaPackageTypeModel } from '../../model/growSocialMediaPackageTypeModel';
import { growSocialMediaPackageSubTypeModel } from '../../model/growSocialMediaPackageSubTypeModel';
import { growSocialMediaPackageEnrollmentModel } from '../../model/growSocialMediaPackageEnrollment';
import { growSocialMediaPackagePaymentModel } from '../../model/growSocialMediaPackagePaymentModel';
import AuthService from '../../services/authService';
import { growPackageTodoModel } from '../../model/growPackageTodoModel';
import { IUser, UserModel } from '../../model/userModel';
import { growSrkAffiliateVerificationModel } from '../../model/growSrkAffiliateVerificationModel';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { growSrkAffiliateEarningStatementModel } from '../../model/grow/growSrkAffiliateEarningStatementModel';
import { growSrkAffiliateUserBalanceModel } from '../../model/grow/growSrkAffiliateUserBalanceModel';

export function calculatePackageDiscount(
  packageId: string,
  packageAmount: number
) {
  const packageDiscount: Record<string, number> = {
    '693bd21b224b9cd931c7cee0': 0.1,
    '693bd21b224b9cd931c7cef2': 0.15,
    '693bd21c224b9cd931c7cf04': 0.2,
  };

  const discountPercentage = packageDiscount[packageId] || 0;
  const discountAmount = packageAmount * discountPercentage;
  const finalAmountAfterDiscount = packageAmount - discountAmount;

  return {
    originalAmount: packageAmount,
    discountPercentage,
    discountAmount,
    finalAmountAfterDiscount,
  };
}

const createGrowSocialMediaEnrollment: AppRouteImplementationOrOptions<
  typeof growContract.createGrowSocialMediaEnrollment
> = async ({ body }) => {
  try {
    const { userData, enrollmentData, paymentData, postEngagement } = body;

    const postURLs = postEngagement?.postURLs ?? [];

    // 1. Validate promo code and find referredBy user using promocode
    let growSocialMediaRefferalUser = null;
    if (userData.usedPromoCode) {
      growSocialMediaRefferalUser =
        await growSocialMediaPackageUserModel.findOne({
          promoCode: userData.usedPromoCode,
        });

      if (!growSocialMediaRefferalUser) {
        return {
          status: 400,
          body: {
            success: false,
            message: 'Invalid promo code',
          },
        };
      }
    }

    // 2. Validate Package, Type, SubType
    const packageExists = await growSocialMediaPackageModel.findById(
      enrollmentData.growSocialMediaPackageId
    );
    if (!packageExists) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Package not found',
        },
      };
    }

    const packageTypeExists = await growSocialMediaPackageTypeModel.findById(
      enrollmentData.growSocialMediaPackageTypeId
    );
    if (
      !packageTypeExists ||
      String(packageTypeExists.growSocialMediaPackageId) !==
        enrollmentData.growSocialMediaPackageId
    ) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Package type invalid or does not belong to package',
        },
      };
    }

    const packageSubTypeExists =
      await growSocialMediaPackageSubTypeModel.findById(
        enrollmentData.growSocialMediaPackageSubTypeId
      );
    if (
      !packageSubTypeExists ||
      String(packageSubTypeExists.growSocialMediaPackageTypeId) !==
        enrollmentData.growSocialMediaPackageTypeId
    ) {
      return {
        status: 400,
        body: {
          success: false,
          message:
            'Package sub-type invalid or does not belong to package type',
        },
      };
    }

    if (
      !enrollmentData?.profileLinkURL?.length &&
      postURLs.length > packageSubTypeExists.noOfVideos
    ) {
      return {
        status: 400,
        body: {
          success: false,
          message: `You can provide a maximum of ${packageSubTypeExists.noOfVideos} video URLs, but received ${postURLs.length}.`,
        },
      };
    }

    // 3. Check duplicate enrollment (active)

    const existingUser = await growSocialMediaPackageUserModel.findOne({
      email: userData.email,
    });

    if (existingUser) {
      const activeEnrollment =
        await growSocialMediaPackageEnrollmentModel.findOne({
          growSocialMediaPackageUserId: existingUser._id,
          isActive: true,
        });

      if (activeEnrollment) {
        return {
          status: 409,
          body: {
            success: false,
            message: 'User already has an active enrollment',
          },
        };
      }
    }

    if (enrollmentData?.profileLinkURL?.length && postURLs.length) {
      return {
        status: 400,
        body: {
          success: false,
          message:
            'Cannot provide both profileLinkURL and postURLs at the same time',
        },
      };
    }

    // 4. Create user
    const hashedPassword = await AuthService.hashPassword(userData.password);

    const packageUser = await growSocialMediaPackageUserModel.create({
      fullName: userData.fullName,
      email: userData.email,
      password: hashedPassword,
      gender: userData.gender,
      phone: userData.phoneNumber,
      country: userData.country,
      kycURL: userData.kycURL,
      promoCode: userData.usedPromoCode,
      userType: 'package',
      referredBy: growSocialMediaRefferalUser
        ? growSocialMediaRefferalUser._id
        : null,
    });

    let amountToStore = packageExists.amount;

    if (userData.usedPromoCode && growSocialMediaRefferalUser) {
      const discountResult = calculatePackageDiscount(
        packageExists._id.toString(),
        packageExists.amount
      );
      amountToStore = discountResult.finalAmountAfterDiscount;
    }

    const taskType = postURLs.length > 0 ? 'like' : 'follow';
    // 5. Create enrollment
    const createSrkGrowPackageEnrollment =
      await growSocialMediaPackageEnrollmentModel.create({
        growSocialMediaPackageUserId: packageUser._id,
        growSocialMediaPackageId: enrollmentData.growSocialMediaPackageId,
        growSocialMediaPackageTypeId:
          enrollmentData.growSocialMediaPackageTypeId,
        growSocialMediaPackageSubTypeId:
          enrollmentData.growSocialMediaPackageSubTypeId,
        socialMediaPlatform: enrollmentData.socialMediaPlatform,
        profileLinkURL: enrollmentData.profileLinkURL,
        amount: amountToStore,
        type: taskType,
      });

    // 6. Create payment record
    await growSocialMediaPackagePaymentModel.create({
      growPackageEnrollmentId: createSrkGrowPackageEnrollment._id,
      paymentURL: paymentData.paymentURL,
      transactionId: paymentData.transactionId,
      paymentMethod: paymentData.paymentMethod,
    });

    if (postURLs.length > 0) {
      await growPackageTodoModel.insertMany(
        postURLs.map((url) => ({
          growSocialMediaPackageEnrollmentId:
            createSrkGrowPackageEnrollment._id,
          postUrl: url,
          type: 'like',
          platform: enrollmentData.socialMediaPlatform,
        }))
      );
    } else {
      await growPackageTodoModel.create({
        growSocialMediaPackageEnrollmentId: createSrkGrowPackageEnrollment._id,
        type: 'follow',
        profileUrl: enrollmentData.profileLinkURL![0],
        platform: enrollmentData.socialMediaPlatform,
      });
    }

    return {
      status: 201,
      body: {
        success: true,
        message: 'Enrollment submitted successfully',
      },
    };
  } catch (error) {
    console.error('Error creating grow social media enrollment:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message
          ? `Internal server error: ${error.message}`
          : 'Internal server error',
      },
    };
  }
};

export const validateGrowUserPromoCode: AppRouteImplementationOrOptions<
  typeof growContract.validateGrowUserPromoCode
> = async ({ body }) => {
  try {
    const { promoCode, growSocialMediaPackageId } = body;

    const srkGrowUser = await growSocialMediaPackageUserModel.findOne({
      promoCode,
    });

    if (!srkGrowUser) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Invalid promo code',
        },
      };
    }

    if (srkGrowUser.status !== 'portalActivated') {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Promo code owner is not active or eligible',
        },
      };
    }

    const growPackage = await growSocialMediaPackageModel.findById(
      growSocialMediaPackageId
    );
    if (!growPackage) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Package not found',
        },
      };
    }

    const {
      originalAmount,
      discountPercentage,
      discountAmount,
      finalAmountAfterDiscount,
    } = calculatePackageDiscount(
      growPackage._id.toString(),
      growPackage.amount
    );

    return {
      status: 200,
      body: {
        success: true,
        message: `Promo code valid! You get a discount of ${
          discountPercentage * 100
        }% on the ${growPackage.name} package.`,
        discountDetails: {
          originalAmount,
          discountPercentage: discountPercentage * 100,
          discountAmount,
          finalAmountAfterDiscount,
          fullName: srkGrowUser.fullName,
        },
      },
    };
  } catch (error) {
    console.error('Error validating promo code:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message
          ? `Internal server error: ${error.message}`
          : 'Internal server error',
      },
    };
  }
};

const acceptSocialGrowEnrollmentRequest: AppRouteImplementationOrOptions<
  typeof growContract.acceptSocialGrowEnrollmentRequest
> = async ({ params }) => {
  try {
    const enrollmentRequest = await growSocialMediaPackageEnrollmentModel
      .findById(params.enrollmentId)
      .populate<{
        growSocialMediaPackageUserId: {
          _id: Types.ObjectId;
          referredBy?: Types.ObjectId;
          status: string;
        };
        growSocialMediaPackageId: {
          _id: Types.ObjectId;
          amount: number;
        };
      }>('growSocialMediaPackageUserId growSocialMediaPackageId');

    if (!enrollmentRequest) {
      return {
        status: 500,
        body: {
          message: 'No Such Enrollment Found',
        },
      };
    }

    const user = enrollmentRequest.growSocialMediaPackageUserId;
    const packageData = enrollmentRequest.growSocialMediaPackageId;

    await growSocialMediaPackageUserModel.findOneAndUpdate(
      {
        _id: enrollmentRequest.growSocialMediaPackageUserId,
      },
      {
        $set: {
          status: 'portalActivated',
        },
      },
      {
        new: true,
      }
    );

    await growSocialMediaPackageEnrollmentModel.findOneAndUpdate(
      {
        _id: params.enrollmentId,
      },
      {
        $set: {
          isActive: true,
        },
      }
    );

    if (user.referredBy) {
      const affiliateCommissionRate = 0.15;
      const affiliateCommissionAmount =
        enrollmentRequest.amount * affiliateCommissionRate;

      // Create earning statement
      await growSrkAffiliateEarningStatementModel.create({
        refferedBY: user.referredBy,
        refferedTo: user._id,
        growSocialMediaPackageId: packageData._id,
        amount: affiliateCommissionAmount,
      });

      const affiliateBalance = await growSrkAffiliateUserBalanceModel.findOne({
        growSocialMediaPackageUserId: user.referredBy,
      });

      if (affiliateBalance) {
        // increment existing balance
        affiliateBalance.wallet += affiliateCommissionAmount;
        await affiliateBalance.save();
      } else {
        // create new balance
        await growSrkAffiliateUserBalanceModel.create({
          growSocialMediaPackageUserId: user.referredBy,
          wallet: affiliateCommissionAmount,
        });
      }
    }

    return {
      status: 200,
      body: {
        message: 'Enrollement Request Accepted',
        success: true,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: {
        message: error.message
          ? `Internal server error: ${error.message}`
          : 'Internal server error',
        success: false,
      },
    };
  }
};

const rejectSocialGrowEnrollmentRequest: AppRouteImplementationOrOptions<
  typeof growContract.rejectSocialGrowEnrollmentRequest
> = async ({ params, body }) => {
  try {
    const enrollmentRequest =
      await growSocialMediaPackageEnrollmentModel.findById(params.enrollmentId);

    if (!enrollmentRequest) {
      return {
        status: 500,
        body: {
          message: 'No Such Enrollment Found',
        },
      };
    }

    await growSocialMediaPackageUserModel.findOneAndUpdate(
      { _id: enrollmentRequest.growSocialMediaPackageUserId },
      {
        $set: {
          status: 'verificationRejected',
        },
      }
    );

    await growSocialMediaPackagePaymentModel.findOneAndUpdate(
      {
        growPackageEnrollmentId: enrollmentRequest._id,
      },
      {
        $set: {
          status: 'rejected',
          rejectionReason: body.rejectionReason,
        },
      }
    );

    return {
      status: 200,
      body: {
        message: 'Follow Request Rejected',
        success: false,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: {
        message: error.message
          ? `Internal server error: ${error.message}`
          : 'Internal server error',
        success: false,
      },
    };
  }
};

const resubmitGrowVerification: AppRouteImplementationOrOptions<
  typeof growContract.resubmitGrowVerification
> = async ({ body }) => {
  try {
    const { userId, kycURLs, transactionId, paymentURL } = body;

    // 1. Update User Profile
    const user = await growSocialMediaPackageUserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          kycURL: kycURLs,
          status: 'verificationPending',
        },
      },
      { new: true }
    );

    if (!user) {
      return {
        status: 404,
        body: { success: false, message: 'User not found' },
      };
    }

    // 2. Find associated enrollment
    const enrollment = await growSocialMediaPackageEnrollmentModel.findOne({
      growSocialMediaPackageUserId: userId,
    });

    if (enrollment) {
      // 3. Update Payment record
      await growSocialMediaPackagePaymentModel.findOneAndUpdate(
        { growPackageEnrollmentId: enrollment._id },
        {
          $set: {
            transactionId,
            paymentURL,
            status: 'pending',
            rejectionReason: null,
          },
        }
      );
    }

    return {
      status: 200,
      body: { success: true, message: 'Verification resubmitted successfully' },
    };
  } catch (error) {
    console.error('Error resubmitting verification:', error);
    return {
      status: 500,
      body: { success: false, message: 'Internal server error' },
    };
  }
};

const createGrowSocialMediaTasks: AppRouteImplementationOrOptions<
  typeof growContract.createGrowSocialMediaTasks
> = async ({ body }) => {
  try {
    const { growSocialMediaPackageEnrollmentId, profileLinkURLs, postURLs } =
      body;

    const activeEnrollment =
      await growSocialMediaPackageEnrollmentModel.findById(
        growSocialMediaPackageEnrollmentId
      );

    if (!activeEnrollment) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Enrollment not found',
        },
      };
    }

    if (!activeEnrollment.isActive) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Enrollment is not active',
        },
      };
    }

    const subType = await growSocialMediaPackageSubTypeModel.findById(
      activeEnrollment.growSocialMediaPackageSubTypeId
    );

    if (!subType) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Package subtype not found',
        },
      };
    }

    if (subType.taskType === 'follow') {
      if (postURLs.length) {
        return {
          status: 400,
          body: {
            success: false,
            message: 'Engagement URLs are not allowed for follow packages',
          },
        };
      }

      const allowedCount = subType.noOfFollowers ?? 0;
      const existingURLs = activeEnrollment.profileLinkURL ?? [];

      // remove duplicates from incoming
      const uniqueIncomingUrlRequest = profileLinkURLs.filter(
        (url) => !existingURLs.includes(url)
      );

      if (
        existingURLs.length + uniqueIncomingUrlRequest.length >
        allowedCount
      ) {
        return {
          status: 400,
          body: {
            success: false,
            message: `You can add only ${allowedCount} profile links for this package`,
          },
        };
      }

      if (uniqueIncomingUrlRequest) {
        await growSocialMediaPackageEnrollmentModel.findByIdAndUpdate(
          activeEnrollment._id,
          {
            $addToSet: {
              profileLinkURL: {
                $each: uniqueIncomingUrlRequest,
              },
            },
          }
        );
      }
    }

    if (subType.taskType === 'engagement') {
      if (profileLinkURLs.length) {
        return {
          status: 400,
          body: {
            success: false,
            message: 'Follow URLs are not allowed for engagement packages',
          },
        };
      }

      const allowedCount = subType.noOfVideos ?? 0;

      const existingEngagement = await growPackageTodoModel.find({
        growSocialMediaPackageEnrollmentId: activeEnrollment._id,
        type: 'like',
      });

      const existingURLs = existingEngagement.map((post) => post.postUrl);

      // remove duplicates from incoming
      const uniqueIncomingUrlRequest = postURLs.filter(
        (url) => !existingURLs.includes(url)
      );

      if (
        existingURLs.length + uniqueIncomingUrlRequest.length >
        allowedCount
      ) {
        return {
          status: 400,
          body: {
            success: false,
            message: `You can add only ${allowedCount} post URLs for this package`,
          },
        };
      }

      if (uniqueIncomingUrlRequest.length) {
        await growPackageTodoModel.insertMany(
          uniqueIncomingUrlRequest.map((url) => ({
            growSocialMediaPackageEnrollmentId: activeEnrollment._id,
            postUrl: url,
            type: 'like',
          }))
        );
      }
    }

    return {
      status: 201,
      body: {
        success: true,
        message: 'Social media tasks created successfully',
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
    };
  }
};

const srkGrowAffiliateVerificationRequest: AppRouteImplementationOrOptions<
  typeof growContract.srkGrowAffiliateVerificationRequest
> = async ({ body }) => {
  try {
    const srkUniversityUserExist = await UserModel.findOne({
      _id: body.srkUniversityUserId,
    });

    if (!srkUniversityUserExist) {
      return {
        status: 500,
        body: {
          message: 'Srk University User not found',
          success: false,
        },
      };
    }

    await growSrkAffiliateVerificationModel.create({
      srkUniversityUserId: body.srkUniversityUserId,
      verificationImageUrl: body.verificationImageUrl,
    });

    return {
      status: 201,
      body: {
        message: 'Srk Grow Affiliate requested successfully',
        success: true,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: {
        message: error.message
          ? `Internal server error: ${error.message}`
          : 'Internal server error',
        success: false,
      },
    };
  }
};

const approveSrkGrowAffiliateVerificationRequest: AppRouteImplementationOrOptions<
  typeof growContract.approveSrkGrowAffiliateVerificationRequest
> = async ({ params }) => {
  try {
    const requestExist = await growSrkAffiliateVerificationModel
      .findOne({ _id: params.srkGrowaffiliateVerificationId })
      .populate<{
        srkUniversityUserId: Pick<
          IUser,
          | '_id'
          | 'firstName'
          | 'lastName'
          | 'email'
          | 'gender'
          | 'country'
          | 'phoneNumber'
          | 'dob'
          | 'profilePicture'
        >;
      }>({
        path: 'srkUniversityUserId',
        select:
          'firstName lastName email gender country phoneNumber dob profilePicture ',
      });

    if (!requestExist) {
      return {
        status: 500,
        body: {
          message: 'Request not found',
          success: false,
        },
      };
    }

    if (requestExist.status === 'approved') {
      return {
        status: 400,
        body: {
          message: 'Request already approved',
          success: false,
        },
      };
    }

    await growSrkAffiliateVerificationModel.findOneAndUpdate(
      { _id: params.srkGrowaffiliateVerificationId },
      { $set: { status: 'approved' } }
    );

    const growUserPromoCode =
      await AuthService.generateUniquePromoCodeForSrkGrowUser();

    await growSocialMediaPackageUserModel.create({
      userType: 'affiliate',
      country: requestExist.srkUniversityUserId.country,
      fullName: `${requestExist.srkUniversityUserId.firstName}  ${requestExist.srkUniversityUserId.lastName}`,
      email: requestExist.srkUniversityUserId.email,
      gender: requestExist.srkUniversityUserId.gender,
      phone: requestExist.srkUniversityUserId.phoneNumber,
      status: 'portalActivated',
      kycURL: requestExist.verificationImageUrl,
      password: '-',
      promoCode: growUserPromoCode,
      srkUniversityUserId: requestExist.srkUniversityUserId._id,
    });

    return {
      status: 201,
      body: {
        message: 'Request Approved',
        success: true,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: {
        message: error.message
          ? `Internal server error: ${error.message}`
          : 'Internal server error',
        success: false,
      },
    };
  }
};

const rejectSrkGrowAffiliateVerificationRequest: AppRouteImplementationOrOptions<
  typeof growContract.rejectSrkGrowAffiliateVerificationRequest
> = async ({ params, body }) => {
  try {
    const requestExist = await growSrkAffiliateVerificationModel.findOne({
      _id: params.srkGrowaffiliateVerificationId,
    });
    if (!requestExist) {
      return {
        status: 500,
        body: {
          message: 'Request not found',
          success: false,
        },
      };
    }

    await growSrkAffiliateVerificationModel.findOneAndUpdate(
      { _id: params.srkGrowaffiliateVerificationId },
      { $set: { status: 'rejected', rejectionReason: body.rejectionReason } }
    );

    return {
      status: 201,
      body: {
        message: 'Request Rejected',
        rejectionReason: body.rejectionReason,
        success: false,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: {
        message: error.message
          ? `Internal server error: ${error.message}`
          : 'Internal server error.',
        succss: false,
      },
    };
  }
};

export const growMutationHandler = {
  createGrowSocialMediaEnrollment,
  validateGrowUserPromoCode,
  acceptSocialGrowEnrollmentRequest,
  rejectSocialGrowEnrollmentRequest,
  resubmitGrowVerification,
  createGrowSocialMediaTasks,
  srkGrowAffiliateVerificationRequest,
  approveSrkGrowAffiliateVerificationRequest,
  rejectSrkGrowAffiliateVerificationRequest,
};
