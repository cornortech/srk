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

const acceptSrkTaskUserEarningsPayout: AppRouteImplementationOrOptions<
  typeof srkTaskContract.acceptSrkTaskUserEarningsPayout
> = async ({ params, body }) => {
  try {
    const srkTaskUserPayoutExists = await srkTasksEarningsPayoutModel.findById(
      params.payoutId
    );

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

    srkTaskUserBalanceExist.totalEarnings += srkTaskUserPayoutExists.amount;

    await srkTaskUserBalanceExist.save();

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
    };
  }
};

const rejectSrkTaskUserEarningsPayout: AppRouteImplementationOrOptions<
  typeof srkTaskContract.rejectSrkTaskUserEarningsPayout
> = async ({ params, body }) => {
  try {
    const srkTaksUserEarningPayoutExists =
      await srkTasksEarningsPayoutModel.findById(params.payoutId);

    const srkTaskUserBalanceExist = await srkTaskUserBalanceModel.findOne({
      taskUserId: srkTaksUserEarningPayoutExists.taskUserId,
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

/**
 *
 */

const srkTaskActionSubmission: AppRouteImplementationOrOptions<
  typeof srkTaskContract.srkTaskActionSubmission
> = async ({ body }) => {
  try {
    // Implementation logic for srkTaskActionSubmission goes here

    const srkTaskUserExist = await srkTaskUserModel.findById(
      body.srkTaskUserId
    );

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

    if (
      existingSubmissionExist &&
      existingSubmissionExist.status === 'approved'
    ) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Action has already been approved',
        },
      };
    }

    if (
      existingSubmissionExist &&
      existingSubmissionExist.status === 'pending'
    ) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Action submission is already pending.',
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

    return {
      status: 201,
      body: {
        success: true,
        message: 'SRK Task Action submitted successfully',
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

    await srkTaskEarningStatementModel.create({
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
        message: 'Action submission approved successfully',
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

    await srkTasksEarningsPayoutModel.create({
      taskUserId: srkTaskUserExist._id,
      status: 'pending',
      amount,
      coinsUsed: body.coins,
      tds: amount * 0.1,
    });

    srkTaskUserBalanceExist.currentCoins -= body.coins;

    await srkTaskUserBalanceExist.save();

    return {
      status: 201,
      body: {
        success: true,
        message: 'SRK Task Earnings Payout request submitted successfully',
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

export const srkTaskMutationHandler = {
  srkTaskEarningsPayoutRequest,
  acceptSrkTaskUserEarningsPayout,
  rejectSrkTaskUserEarningsPayout,
  submitSrkTaskOnboardingVerification,
  approveSrkTaskOnboardingVerificationByAdmin,
  rejectSrkTaskOnboardingVerificationByAdmin,
  srkTaskActionSubmission,
  approveSrkTaskActionSubmissionByAdmin,
  rejectSrkTaskActionSubmissionByAdmin,
};
