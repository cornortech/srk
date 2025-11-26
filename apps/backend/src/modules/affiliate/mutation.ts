import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { affiliateContract } from '../../contract/affiliate/contract';
import { affiliateRequestModel } from '../../model/affiliateRequestModel';
import { UserModel } from '../../model/userModel';
import { SrkBankModel } from '../../model/srkBankModel';
import { affiliateBiometricModel } from '../../model/affiliateVerificationModel';
import { balanceModel } from '../../model/balanceModel';
import EmailService from '../../services/emailService';
import { methods } from '../../utils/methods';

const affiliateRequest: AppRouteImplementationOrOptions<
  typeof affiliateContract.affiliateRequest
> = async ({ params }) => {
  try {
    const existingAffiliateRequest = await affiliateRequestModel.findOne({
      userId: params.userId,
    });

    if (
      existingAffiliateRequest &&
      existingAffiliateRequest.status === 'pending'
    ) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Affiliate request is already sent',
        },
      };
    }

    if (!existingAffiliateRequest) {
      await affiliateRequestModel.create({
        userId: params.userId,
        status: 'pending',
        requestedAt: new Date(),
      });
    } else {
      existingAffiliateRequest.status = 'pending';
      existingAffiliateRequest.requestedAt = new Date();
      await existingAffiliateRequest.save();
    }
    return {
      status: 200,
      body: {
        success: true,
        message: 'Request sent successfully',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};
const approveAffiliateRequest: AppRouteImplementationOrOptions<
  typeof affiliateContract.approveAffiliateRequest
> = async ({ params }) => {
  try {
    const existingAffiliateRequest = await affiliateRequestModel.findOne({
      userId: params.userId,
    });

    const userExist = await UserModel.findById(params.userId);

    if (!userExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    if (!existingAffiliateRequest) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Request not found',
        },
      };
    }

    if (userExist.affiliateEnabled) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Affiliate already enabled',
        },
      };
    }

    userExist.affiliateEnabled = true;
    existingAffiliateRequest.status = 'approved';

    await existingAffiliateRequest.save();
    await userExist.save();

    const srkBankExist = await SrkBankModel.findOne({
      userId: params.userId,
    });

    const userBalanceExist = await balanceModel.findOne({
      userId: params.userId,
    });

    if (!srkBankExist) {
      const newSrkBank = await SrkBankModel.create({
        userId: params.userId,
        accountNumber: methods.generateSRKBankId(),
      });
      userExist.srkBankId = newSrkBank._id;
      await userExist.save();
    }

    if (!userBalanceExist) {
      await balanceModel.create({
        userId: params.userId,
      });
    }

    EmailService.sendEmail({
      email: userExist.email,
      subject: 'Affiliate request approved',
      message: `
      <p>Hi ${userExist.firstName},</p>
      <p> Your affiliate request has been approved.</p>
      `,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Request approved successfully',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const addAffiliateBiometricData: AppRouteImplementationOrOptions<
  typeof affiliateContract.addAffiliateBiometricData
> = async ({ params, body }) => {
  try {
    const userExist = await UserModel.findById(params.userId);

    if (!userExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    const existingAffiliateBiometricData =
      await affiliateBiometricModel.findOne({
        userId: params.userId,
      });

    if (existingAffiliateBiometricData) {
      existingAffiliateBiometricData.verificationImage = body.verificationImage;
      existingAffiliateBiometricData.leftThumbPrint = body.leftThumbPrint;
      existingAffiliateBiometricData.rightThumbPrint = body.rightThumbPrint;
      await existingAffiliateBiometricData.save();
    } else {
      await affiliateBiometricModel.create({
        userId: params.userId,
        verificationImage: body.verificationImage,
        leftThumbPrint: body.leftThumbPrint,
        rightThumbPrint: body.rightThumbPrint,
      });
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Biometric data added successfully',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const rejectAffiliateRequest: AppRouteImplementationOrOptions<
  typeof affiliateContract.rejectAffiliateRequest
> = async ({ params, body }) => {
  try {
    const userExist = await UserModel.findById(params.userId);

    if (!userExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }
    const existingAffiliateRequest = await affiliateRequestModel.findOne({
      userId: params.userId,
    });

    if (!existingAffiliateRequest) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Request not found',
        },
      };
    }

    existingAffiliateRequest.status = 'rejected';
    existingAffiliateRequest.rejectionReason = body.reason;
    userExist.affiliateEnabled = false;
    await existingAffiliateRequest.save();
    await userExist.save();

    EmailService.sendEmail({
      email: userExist.email,
      message: `
      <p>Hi ${userExist.firstName},</p>
      <p> Your affiliate request has been rejected.</p>
      `,
      subject: 'Affiliate request rejected',
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Request rejected successfully',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

export const affiliateMutationHandler = {
  affiliateRequest,
  addAffiliateBiometricData,
  approveAffiliateRequest,
  rejectAffiliateRequest,
};
