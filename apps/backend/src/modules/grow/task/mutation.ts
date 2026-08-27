import { srkTaskContract } from '@srk/shared/contracts';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { srkTasksEarningsPayoutModel } from '../../../model/task/srkTasksEarningsPayoutModel';
import { srkTaskOnboardingVerificationRequestModel } from '../../../model/task/srkTaskOnboardingVerificationRequestModel';
import { UserModel } from '../../../model/userModel';
import { srkTaskUserModel } from '../../../model/task/srkTaskUserModel';
import { srkTaskActionSubmissionModel } from '../../../model/task/srkTaskActionSubmissionModel';
import { growPackageTodoModel } from '../../../model/growPackageTodoModel';
import { growSocialMediaPackageEnrollmentModel } from '../../../model/growSocialMediaPackageEnrollment';
import { srkTaskUserBalanceModel } from '../../../model/task/srkTaskUserBalanceModel';
import { srkTaskEarningStatementModel } from '../../../model/task/srkTaskEarningStatementModel';
import { srkTaskUserPaymentDetailsRequestModel } from '../../../model/task/srkTaskUserPaymentDetailsRequestModel';
import mongoose from 'mongoose';
import { cleanupDataUrlUploads } from '../../../utils/dataUrlUploadMiddleware';

const acceptSrkTaskUserEarningsPayout: AppRouteImplementationOrOptions<
  typeof srkTaskContract.acceptSrkTaskUserEarningsPayout
> = async ({ params, body }) => {
  try {
    const srkTaskUserPayoutExists = await srkTasksEarningsPayoutModel.findById(
      params.payoutId
    );

    if (!srkTaskUserPayoutExists) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Task Earning Payout not found',
        },
      };
    }

    const srkTaskUserBalanceExist = await srkTaskUserBalanceModel.findOne({
      taskUserId: srkTaskUserPayoutExists.taskUserId,
    });

    if (!srkTaskUserBalanceExist) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'SRK Task User Balance does not exist',
        },
      };
    }

    if (!srkTaskUserPayoutExists) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Task Earning Payout not found',
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

    await srkTaskUserPayoutExists.save();

    srkTaskUserBalanceExist.totalEarnings += srkTaskUserPayoutExists.amount;

    await srkTaskUserBalanceExist.save();

    return {
      status: 200,
      body: {
        success: true,
        message: 'Task Payout accepted successfully',
      },
    };
  } catch (error: unknown) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `Internal server error: ${errorMessage}`,
      },
    };
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
        status: 404,
        body: {
          success: false,
          message: 'Task Earning Payout not found',
        },
      };
    }

    const srkTaskUserBalanceExist = await srkTaskUserBalanceModel.findOne({
      taskUserId: srkTaksUserEarningPayoutExists.taskUserId,
    });

    if (!srkTaskUserBalanceExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'SRK Task User Balance does not exist',
        },
      };
    }

    if (!srkTaksUserEarningPayoutExists) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Affiliate Earning Payout not found',
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

    srkTaskUserBalanceExist.currentCoins +=
      srkTaksUserEarningPayoutExists.coinsUsed;

    await srkTaskUserBalanceExist.save();

    return {
      status: 200,
      body: {
        success: true,
        message: 'Task Payout rejected successfully',
      },
    };
  } catch (error: unknown) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `Internal server error: ${errorMessage}`,
      },
    };
  }
};

const submitSrkTaskOnboardingVerification: AppRouteImplementationOrOptions<
  typeof srkTaskContract.submitSrkTaskOnboardingVerification
> = async ({ params, body }) => {
  try {
    const srkUniversityUserExist = await UserModel.findById(
      params.srkUniversityId
    );

    if (!srkUniversityUserExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'SRK University User does not exist',
        },
      };
    }

    const srkTaskUserExist = await srkTaskUserModel.findOne({
      srkUniversityUserId: srkUniversityUserExist._id,
    });

    const srkTaskOnboardingRequestExist =
      await srkTaskOnboardingVerificationRequestModel.findOne({
        taskUserId: srkTaskUserExist?._id,
      });

    if (srkTaskOnboardingRequestExist?.status === 'pending') {
      return {
        status: 400,
        body: {
          success: false,
          message: 'There is already a pending onboarding verification request',
        },
      };
    }

    if (srkTaskUserExist?.isActivated) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'SRK Task User is already activated',
        },
      };
    }

    if (!srkTaskUserExist) {
      const newSrkTaskUserExist = await srkTaskUserModel.create({
        fullName: body.fullName,
        srkUniversityUserId: srkUniversityUserExist._id,
        dob: body.dateOfBirth,
        isActivated: false,
      });

      await srkTaskOnboardingVerificationRequestModel.create({
        taskUserId: newSrkTaskUserExist._id,
        imageUrl: body.verificationImageUrl,
        kycDocumentUrl: body.documentUrl,
        signatureUrl: body.signatureUrl,
        fullName: body.fullName,
        dateOfBirth: body.dateOfBirth,
        status: 'pending',
      });
    } else {
      srkTaskUserExist.fullName = body.fullName;
      srkTaskUserExist.dob = body.dateOfBirth;
      await srkTaskUserExist.save();

      await srkTaskOnboardingVerificationRequestModel.findOneAndUpdate(
        { taskUserId: srkTaskUserExist._id },
        {
          imageUrl: body.verificationImageUrl,
          kycDocumentUrl: body.documentUrl,
          signatureUrl: body.signatureUrl,
          fullName: body.fullName,
          dateOfBirth: body.dateOfBirth,
          status: 'pending',
        }
      );
    }

    return {
      status: 201,
      body: {
        success: true,
        message: 'Onboarding verification submitted successfully',
      },
    };
  } catch (error: unknown) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `Internal server error: ${errorMessage}`,
      },
    };
  }
};

const approveSrkTaskOnboardingVerificationByAdmin: AppRouteImplementationOrOptions<
  typeof srkTaskContract.approveSrkTaskOnboardingVerificationByAdmin
> = async ({ params }) => {
  try {
    const onboardingRequest =
      await srkTaskOnboardingVerificationRequestModel.findOne({
        taskUserId: params.srkTaskUserId,
      });

    if (!onboardingRequest) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Onboarding verification request not found',
        },
      };
    }

    onboardingRequest.status = 'approved';
    await onboardingRequest.save();

    const srkTaskUser = await srkTaskUserModel.findById(params.srkTaskUserId);

    if (!srkTaskUser) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'SRK Task User not found',
        },
      };
    }

    srkTaskUser.isActivated = true;
    await srkTaskUser.save();

    await srkTaskUserBalanceModel.create({
      taskUserId: srkTaskUser._id,
      totalCoinsEarned: 0,
      currentCoins: 0,
      totalEarnings: 0,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Onboarding verification approved successfully',
      },
    };
  } catch (error: unknown) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `Internal server error: ${errorMessage}`,
      },
    };
  }
};
const rejectSrkTaskOnboardingVerificationByAdmin: AppRouteImplementationOrOptions<
  typeof srkTaskContract.rejectSrkTaskOnboardingVerificationByAdmin
> = async ({ params, body }) => {
  try {
    const onboardingRequestExist =
      await srkTaskOnboardingVerificationRequestModel.findOne({
        taskUserId: params.srkTaskUserId,
      });

    if (!onboardingRequestExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Onboarding verification request not found',
        },
      };
    }

    onboardingRequestExist.status = 'rejected';
    onboardingRequestExist.rejectionReason = body.rejectionReason;
    await onboardingRequestExist.save();

    return {
      status: 200,
      body: {
        success: true,
        message: 'Onboarding verification rejected successfully',
      },
    };
  } catch (error: unknown) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `Internal server error: ${errorMessage}`,
      },
    };
  }
};

/**
 *
 */

const PACKAGE_LIMITS: Record<string, number> = {
  'SRK Basic': 5,
  'SRK Lite': 4,
  'SRK Standard': 10,
  'SRK Premium': 15,
  'SRK PRO': 18,
};

const srkTaskActionSubmission: AppRouteImplementationOrOptions<
  typeof srkTaskContract.srkTaskActionSubmission
> = async ({ body, req }) => {
  let isSuccessful = false;
  try {
    const srkTaskUserExist = await srkTaskUserModel
      .findById(body.srkTaskUserId)
      .populate<{ srkUniversityUserId: any }>('srkUniversityUserId');

    if (!srkTaskUserExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'SRK Task User does not exist',
        },
      };
    }

    const srkTaskUserBalanceExist = await srkTaskUserBalanceModel.findOne({
      taskUserId: body.srkTaskUserId,
    });

    if (!srkTaskUserBalanceExist) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'SRK Task User Balance does not exist',
        },
      };
    }

    const existingSubmissionExist = await srkTaskActionSubmissionModel.findOne({
      growPackageTodoId: body.actionTodoId,
      taskUserId: body.srkTaskUserId,
    });

    if (existingSubmissionExist) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'You have already submitted this task and cannot submit it again.',
        },
      };
    }

    const srkGrowTodoExist = await growPackageTodoModel
      .findById(body.actionTodoId)
      .populate<{
        growSocialMediaPackageEnrollmentId: {
          type: 'follow' | 'like';
          growSocialMediaPackageUserId: {
            fullName: string;
          };
        };
      }>({
        path: 'growSocialMediaPackageEnrollmentId',
        populate: { path: 'growSocialMediaPackageUserId' },
      });

    if (!srkGrowTodoExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Grow Package Todo does not exist',
        },
      };
    }

    const enrollment = srkGrowTodoExist.growSocialMediaPackageEnrollmentId;
    const taskType = enrollment.type;
    const isFollowType = taskType === 'follow';
    const actionType = isFollowType ? 'following' : 'liking';
    const targetType = isFollowType ? 'profile' : 'post';
    const userName =
      enrollment.growSocialMediaPackageUserId?.fullName || 'Unknown User';

    const actionSubmissionDescription = `Task action submission for ${actionType} a ${targetType} of ${userName}`;

    if (existingSubmissionExist) {
      existingSubmissionExist.description = actionSubmissionDescription;
      existingSubmissionExist.type = taskType;
      existingSubmissionExist.screenshotUrl = body.actionVerificationImageUrl;
      existingSubmissionExist.status = 'pending';
      existingSubmissionExist.rejectionReason = undefined;
      await existingSubmissionExist.save();
    } else {
      await srkTaskActionSubmissionModel.create({
        growPackageTodoId: body.actionTodoId,
        type: taskType,
        taskUserId: body.srkTaskUserId,
        screenshotUrl: body.actionVerificationImageUrl,
        status: 'pending',
        description: actionSubmissionDescription,
      });
    }

    isSuccessful = true;

    return {
      status: 201,
      body: {
        success: true,
        message: 'SRK Task Action submitted successfully',
      },
    };
  } catch (error: unknown) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `Internal server error: ${errorMessage}`,
      },
    };
  } finally {
    if (!isSuccessful) {
      await cleanupDataUrlUploads(req);
    }
  }
};

const approveSrkTaskActionSubmissionByAdmin: AppRouteImplementationOrOptions<
  typeof srkTaskContract.approveSrkTaskActionSubmissionByAdmin
> = async ({ params }) => {
  try {
    const actionSubmission = await srkTaskActionSubmissionModel.findById(
      params.submissionId
    );

    if (!actionSubmission) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Action submission not found',
        },
      };
    }

    // Check submission limits based on package before approving
    const srkTaskUserExist = await srkTaskUserModel
      .findById(actionSubmission.taskUserId)
      .populate<{ srkUniversityUserId: any }>('srkUniversityUserId');

    if (!srkTaskUserExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'SRK Task User does not exist',
        },
      };
    }

    const universityUser = await UserModel.findById(
      srkTaskUserExist.srkUniversityUserId
    ).populate<{ packageId: any }>('packageId');

    const packageName = universityUser?.packageId?.title || 'SRK Basic';
    const maxLimit = PACKAGE_LIMITS[packageName] || 5;

    // Use the submission's createdAt date for the limit check
    const submissionDate = new Date(actionSubmission.createdAt);
    const startOfDay = new Date(submissionDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(submissionDate);
    endOfDay.setHours(23, 59, 59, 999);

    const approvedSubmissionsOnThatDay =
      await srkTaskActionSubmissionModel.countDocuments({
        taskUserId: actionSubmission.taskUserId,
        status: 'approved',
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

    if (approvedSubmissionsOnThatDay >= maxLimit) {
      return {
        status: 400,
        body: {
          success: false,
          message: `The user has reached the maximum daily approval limit for their ${packageName} package (${maxLimit}) for submissions on ${startOfDay.toLocaleDateString()}.`,
        },
      };
    }

    const srkGrowTodoExist = await growPackageTodoModel.findById(
      actionSubmission.growPackageTodoId
    );

    if (!srkGrowTodoExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Grow Package Todo not found',
        },
      };
    }

    const packageEnrollmentExist = await growSocialMediaPackageEnrollmentModel
      .findById(srkGrowTodoExist.growSocialMediaPackageEnrollmentId)
      .populate<{
        growSocialMediaPackageUserId: { fullName: string };
      }>('growSocialMediaPackageUserId')
      .lean();

    if (!packageEnrollmentExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Package enrollment not found',
        },
      };
    }

    actionSubmission.status = 'approved';
    await actionSubmission.save();

    const isFollowType = packageEnrollmentExist.type === 'follow';
    const actionType = isFollowType ? 'following' : 'liking';
    const targetType = isFollowType ? 'profile' : 'post';
    const userName =
      packageEnrollmentExist.growSocialMediaPackageUserId?.fullName ||
      'Unknown User';

    await growPackageTodoModel.findByIdAndUpdate(
      actionSubmission.growPackageTodoId,
      {
        ...(isFollowType
          ? { $inc: { followCounts: 1 } }
          : { $inc: { likeCounts: 1 } }),
      }
    );

    return {
      status: 200,
      body: {
        success: true,
        message: 'Action submission approved successfully',
      },
    };
  } catch (error: unknown) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `Internal server error: ${errorMessage}`,
      },
    };
  }
};

const claimCoinsForTaskActionSubmission: AppRouteImplementationOrOptions<
  typeof srkTaskContract.claimCoinsForTaskActionSubmission
> = async ({ params }) => {
  try {
    const actionSubmission = await srkTaskActionSubmissionModel.findById(
      params.submissionId
    );

    if (!actionSubmission) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Action submission not found',
        },
      };
    }

    if (actionSubmission.status !== 'approved') {
      return {
        status: 400,
        body: {
          success: false,
          message: `Cannot claim coins. Submission status is '${actionSubmission.status}'. Only 'approved' submissions can claim coins.`,
        },
      };
    }

    // Fetch the todo to get package enrollment info
    const srkGrowTodoExist = await growPackageTodoModel.findById(
      actionSubmission.growPackageTodoId
    );

    if (!srkGrowTodoExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Grow Package Todo not found',
        },
      };
    }

    const packageEnrollmentExist = await growSocialMediaPackageEnrollmentModel
      .findById(srkGrowTodoExist.growSocialMediaPackageEnrollmentId)
      .populate<{
        growSocialMediaPackageUserId: { fullName: string };
      }>('growSocialMediaPackageUserId')
      .lean();

    if (!packageEnrollmentExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Package enrollment not found',
        },
      };
    }

    // Update submission status to claimed
    actionSubmission.status = 'claimed';
    actionSubmission.hasClaimedEarning = true;
    await actionSubmission.save();

    const isFollowType = packageEnrollmentExist.type === 'follow';
    const actionType = isFollowType ? 'following' : 'liking';
    const targetType = isFollowType ? 'profile' : 'post';
    const userName =
      packageEnrollmentExist.growSocialMediaPackageUserId?.fullName ||
      'Unknown User';

    // Update user balance with coins
    const updatedBalance = await srkTaskUserBalanceModel.findOneAndUpdate(
      { taskUserId: actionSubmission.taskUserId },
      {
        $inc: {
          totalCoinsEarned: 100,
          currentCoins: 100,
        },
      },
      { new: true }
    );

    if (!updatedBalance) {
      return {
        status: 500,
        body: {
          success: false,
          message: 'Failed to update user balance',
        },
      };
    }

    // Create earning statement
    await srkTaskEarningStatementModel.create({
      taskActionSubmissionId: actionSubmission._id,
      taskUserId: actionSubmission.taskUserId,
      growPackageTodoId: actionSubmission.growPackageTodoId,
      description: `Earning from task action submission from ${actionType} a ${targetType} of ${userName}`,
      type: 'credit',
      coin: 100,
      coinAfterTransaction: updatedBalance.currentCoins,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Coins claimed successfully',
      },
    };
  } catch (error: unknown) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `Internal server error: ${errorMessage}`,
      },
    };
  }
};

const rejectSrkTaskActionSubmissionByAdmin: AppRouteImplementationOrOptions<
  typeof srkTaskContract.rejectSrkTaskActionSubmissionByAdmin
> = async ({ params, body }) => {
  try {
    const actionSubmission = await srkTaskActionSubmissionModel.findById(
      params.submissionId
    );

    if (!actionSubmission) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Action submission not found',
        },
      };
    }

    actionSubmission.status = 'rejected';
    actionSubmission.rejectionReason = body.rejectionReason;
    await actionSubmission.save();

    return {
      status: 200,
      body: {
        success: true,
        message: 'Action submission rejected successfully',
      },
    };
  } catch (error: unknown) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `Internal server error: ${errorMessage}`,
      },
    };
  }
};

const getMoneytaryValueFromCoins = (coins: number): number => {
  return coins / 100;
};

const srkTaskEarningsPayoutRequest: AppRouteImplementationOrOptions<
  typeof srkTaskContract.srkTaskEarningsPayoutRequest
> = async ({ body }) => {
  try {
    const srkTaskUserExist = await srkTaskUserModel.findById(
      body.srkTaskUserId
    );

    const srkTaskUserBalanceExist = await srkTaskUserBalanceModel.findOne({
      taskUserId: body.srkTaskUserId,
    });

    if (!srkTaskUserBalanceExist) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'SRK Task User Balance does not exist',
        },
      };
    }

    if (!srkTaskUserExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'SRK Task User does not exist',
        },
      };
    }

    if (body.coins < 20000) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Minimum payout request is 20,000 coins',
        },
      };
    }

    if (srkTaskUserBalanceExist.currentCoins < body.coins) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Insufficient coins for payout request',
        },
      };
    }

    const amount = getMoneytaryValueFromCoins(body.coins);
    const amountAfterTds = amount - amount * 0.1;

    await srkTasksEarningsPayoutModel.create({
      taskUserId: srkTaskUserExist._id,
      status: 'pending',
      amount: amountAfterTds,
      coinsUsed: body.coins,
      tds: amount * 0.1,
    });

    const updatedBalance: any = await srkTaskUserBalanceModel.findOneAndUpdate(
      { taskUserId: body.srkTaskUserId },
      {
        $inc: {
          currentCoins: -body.coins,
        },
      },
      { new: true }
    );

    await srkTaskEarningStatementModel.create({
      taskUserId: srkTaskUserExist._id,
      growPackageTodoId: null,
      description: `Exchanged ${body.coins} coins for ${amountAfterTds} amount`,
      type: 'debit',
      coin: body.coins,
      coinAfterTransaction: updatedBalance.currentCoins,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: 'SRK Task Earnings Payout request submitted successfully',
      },
    };
  } catch (error: unknown) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `Internal server error: ${errorMessage}`,
      },
    };
  }
};

// ============================================
// Payment Details Mutation Handlers
// ============================================

const submitPaymentDetailsRequest: AppRouteImplementationOrOptions<
  typeof srkTaskContract.submitPaymentDetailsRequest
> = async ({ params, body }) => {
  try {
    const { userId } = params;

    // Check if user exists
    const userExists = await srkTaskUserModel.findById(userId);
    if (!userExists) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    // Check if there's already a pending request
    const pendingRequest = await srkTaskUserPaymentDetailsRequestModel.findOne({
      srkTaskUserId: userId,
      status: 'pending',
    });

    if (pendingRequest) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'You already have a pending payment details request',
        },
      };
    }

    // Create new request
    await srkTaskUserPaymentDetailsRequestModel.create({
      srkTaskUserId: userId,
      accountHolderName: body.accountHolderName,
      bankName: body.bankName,
      accountNumber: body.accountNumber,
      branchName: body.branchName,
      qrCodeUrl: body.qrCodeUrl,
      status: 'pending',
    });

    return {
      status: 201,
      body: {
        success: true,
        message: 'Payment details request submitted successfully',
      },
    };
  } catch (error: unknown) {
    console.error('Error submitting payment details request:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `${
          errorMessage || 'Failed to submit payment details request'
        }`,
      },
    };
  }
};

const reviewPaymentDetailsRequest: AppRouteImplementationOrOptions<
  typeof srkTaskContract.reviewPaymentDetailsRequest
> = async ({ body }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId, status, rejectionReason } = body;

    // Find the request
    const request = await srkTaskUserPaymentDetailsRequestModel
      .findById(requestId)
      .session(session);

    if (!request) {
      await session.abortTransaction();
      return {
        status: 404,
        body: {
          success: false,
          message: 'Payment details request not found',
        },
      };
    }

    if (request.status !== 'pending') {
      await session.abortTransaction();
      return {
        status: 400,
        body: {
          success: false,
          message: `Request already ${request.status}`,
        },
      };
    }

    // Update request status
    request.status = status;
    request.reviewedAt = new Date();
    if (status === 'rejected' && rejectionReason) {
      request.rejectionReason = rejectionReason;
    }

    // If approved, mark any previous approved requests as inactive
    if (status === 'approved') {
      await srkTaskUserPaymentDetailsRequestModel.updateMany(
        {
          srkTaskUserId: request.srkTaskUserId,
          _id: { $ne: request._id },
          status: 'approved',
        },
        { isActive: false },
        { session }
      );
    }

    await request.save({ session });

    await session.commitTransaction();

    return {
      status: 200,
      body: {
        success: true,
        message: `Payment details request ${status} successfully`,
      },
    };
  } catch (error: unknown) {
    await session.abortTransaction();
    console.error('Error reviewing payment details request:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `${
          errorMessage || 'Failed to review payment details request'
        }`,
      },
    };
  } finally {
    session.endSession();
  }
};

const bulkApproveSrkTaskSubmissionsByAdmin: AppRouteImplementationOrOptions<
  typeof srkTaskContract.bulkApproveSrkTaskSubmissionsByAdmin
> = async ({ body, req }) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { submissionIds } = body;

    const pendingSubmissions = await srkTaskActionSubmissionModel
      .find({
        _id: { $in: submissionIds },
        status: 'pending',
      })
      .session(session);

    if (pendingSubmissions.length === 0) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'No pending submissions found for the provided IDs',
        },
      };
    }

    // Since we are approving for a user, we check their specific limit
    // Assuming they are all from the same user as implied by the UI context
    const firstSubmission = pendingSubmissions[0];
    const srkTaskUserExist = await srkTaskUserModel
      .findById(firstSubmission.taskUserId)
      .populate<{ srkUniversityUserId: any }>('srkUniversityUserId')
      .session(session);

    if (!srkTaskUserExist) {
      await session.abortTransaction();
      return {
        status: 404,
        body: {
          success: false,
          message: 'SRK Task User does not exist',
        },
      };
    }

    let successfullyApproved = 0;

    for (const submission of pendingSubmissions) {
      // 1. Update submission status
      submission.status = 'approved';
      await submission.save({ session });
      // dailyApprovedCounts.set(dayKey, currentDayCount + 1);
      successfullyApproved++;
    }

    await session.commitTransaction();
    return {
      status: 200,
      body: {
        success: true,
        message: `Successfully approved ${successfullyApproved} submissions`,
        /* message: limitReached
          ? `Approved ${successfullyApproved} submissions. User limit of ${maxLimit} for ${packageName} package reached.`
          : `Successfully approved ${successfullyApproved} submissions`, */
      },
    };
  } catch (error: unknown) {
    console.error('Error bulk approving submissions:', error);
    await session.abortTransaction();
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `${errorMessage || 'Failed to bulk approve submissions'}`,
      },
    };
  } finally {
    session.endSession();
  }
};

const bulkRejectSrkTaskSubmissionsByAdmin: AppRouteImplementationOrOptions<
  typeof srkTaskContract.bulkRejectSrkTaskSubmissionsByAdmin
> = async ({ body, req }) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const adminId = (req as any).user?._id || 'system';
    const { submissionIds, rejectionReason } = body;

    const result = await srkTaskActionSubmissionModel.updateMany(
      {
        _id: { $in: submissionIds },
        status: 'pending',
      },
      {
        $set: {
          status: 'rejected',
          rejectionReason: `${rejectionReason} (Bulk Rejected by Admin ID: ${adminId})`,
        },
      },
      { session }
    );

    if (result.matchedCount === 0) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'No pending submissions found for the provided IDs',
        },
      };
    }

    await session.commitTransaction();
    return {
      status: 200,
      body: {
        success: true,
        message: `Successfully rejected ${result.modifiedCount} submissions`,
      },
    };
  } catch (error: unknown) {
    await session.abortTransaction();
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return {
      status: 500,
      body: {
        success: false,
        message: `${errorMessage || 'Failed to bulk reject submissions'}`,
      },
    };
  } finally {
    session.endSession();
  }
};

export const srkTaskMutationHandler = {
  srkTaskEarningsPayoutRequest,
  acceptSrkTaskUserEarningsPayout,
  rejectSrkTaskUserEarningsPayout,
  submitSrkTaskOnboardingVerification,
  approveSrkTaskOnboardingVerificationByAdmin,
  rejectSrkTaskOnboardingVerificationByAdmin,
  srkTaskActionSubmission,
  approveSrkTaskActionSubmissionByAdmin,
  claimCoinsForTaskActionSubmission,
  rejectSrkTaskActionSubmissionByAdmin,
  bulkApproveSrkTaskSubmissionsByAdmin,
  bulkRejectSrkTaskSubmissionsByAdmin,
  submitPaymentDetailsRequest,
  reviewPaymentDetailsRequest,
};
