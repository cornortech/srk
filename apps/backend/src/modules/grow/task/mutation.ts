import { srkTaskContract } from '@srk/shared/contracts';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { srkTasksEarningsPayoutModel } from '../../../model/task/srkTasksEarningsPayoutModel';
import { srkTaskOnboardingVerificationRequestModel } from 'apps/backend/src/model/task/srkTaskOnboardingVerificationRequestModel';
import { UserModel } from 'apps/backend/src/model/userModel';
import { srkTaskUserModel } from 'apps/backend/src/model/task/srkTaskUserModel';
import { srkTaskActionSubmissionModel } from 'apps/backend/src/model/task/srkTaskActionSubmissionModel';

const acceptSrkTaskUserEarningsPayout: AppRouteImplementationOrOptions<
  typeof srkTaskContract.acceptSrkTaskUserEarningsPayout
> = async ({ params, body }) => {
  try {
    const srkTaskUserPayoutExists = await srkTasksEarningsPayoutModel.findById(
      params.payoutId
    );

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

    if (srkTaskUserExist.isActivated) {
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

    const existingSubmissionExist = await srkTaskActionSubmissionModel.findOne({
      growEnrollmentId: body.srkGrowEnrollmentId,
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

    if (existingSubmissionExist) {
      existingSubmissionExist.screenshotUrl = body.actionVerificationImageUrl;
      existingSubmissionExist.status = 'pending';
      existingSubmissionExist.rejectionReason = undefined;
      await existingSubmissionExist.save();
    } else {
      await srkTaskActionSubmissionModel.create({
        growEnrollmentId: body.srkGrowEnrollmentId,
        taskUserId: body.srkTaskUserId,
        screenshotUrl: body.actionVerificationImageUrl,
        status: 'pending',
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

const approveSrkTaskActionByAdmin: AppRouteImplementationOrOptions<
  typeof srkTaskContract.approveSrkTaskActionByAdmin
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

    actionSubmission.status = 'approved';
    await actionSubmission.save();

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

const rejectSrkTaskActionByAdmin: AppRouteImplementationOrOptions<
  typeof srkTaskContract.rejectSrkTaskActionByAdmin
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

export const srkTaskMutationHandler = {
  acceptSrkTaskUserEarningsPayout,
  rejectSrkTaskUserEarningsPayout,
  submitSrkTaskOnboardingVerification,
  approveSrkTaskOnboardingVerificationByAdmin,
  rejectSrkTaskOnboardingVerificationByAdmin,
  srkTaskActionSubmission,
  approveSrkTaskActionByAdmin,
  rejectSrkTaskActionByAdmin,
};
