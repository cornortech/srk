import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { UserModel } from '../../model/userModel';
import { KYCModel } from '../../model/kycModel';
import AuthService from '../../services/authService';
import { userContract } from '@srk/shared/contracts';
import { BankModel } from '../../model/bankModel';

const updateUserDetails: AppRouteImplementationOrOptions<
  typeof userContract.updateUserDetails
> = async ({ body, params }) => {
  // Update user details in the database

  const UserExist = await UserModel.findById(params.userId);

  if (!UserExist) {
    return {
      status: 404,
      body: {
        success: false,
        message: 'User not found',
      },
    };
  }

  await UserModel.findByIdAndUpdate(params.userId, {
    $set: {
      ...(body.userDetails.country
        ? { country: body.userDetails.country }
        : {}),
      ...(body.userDetails.dob ? { dob: body.userDetails.dob } : {}),
      ...(body.userDetails.email ? { email: body.userDetails.email } : {}),
      ...(body.userDetails.firstName
        ? { firstName: body.userDetails.firstName }
        : {}),
      ...(body.userDetails.purpose
        ? { purpose: body.userDetails.purpose }
        : {}),
      ...(body.userDetails.lastName
        ? { lastName: body.userDetails.lastName }
        : {}),
      ...(body.userDetails.phoneNumber
        ? { phoneNumber: body.userDetails.phoneNumber }
        : {}),
      ...(body.userDetails.profilePicture
        ? { profilePicture: body.userDetails.profilePicture }
        : {}),
      ...(body.userDetails.gender ? { gender: body.userDetails.gender } : {}),
      ...(body.userDetails.allowedToAddUsers !== undefined ||
      body.userDetails.allowedToAddUsers !== null
        ? { allowedToAddUsers: body.userDetails.allowedToAddUsers }
        : {}),
    },
  });
  const bankDetailsExist = await BankModel.findOne({
    userId: params.userId,
  });

  /**
   * If bank details exist, create or update the bank details in the database
   */

  if (body.bankDetails) {
    if (bankDetailsExist) {
      await BankModel.findOneAndUpdate(
        {
          userId: params.userId,
        },
        {
          $set: {
            holderName: body.bankDetails.holderName,
            accountNumber: body.bankDetails.accountNumber,
            confirmAccountNumber: body.bankDetails.confirmAccountNumber,
            ifscCode: body.bankDetails.ifscCode,
            bankName: body.bankDetails.bankName,
            branchName: body.bankDetails.branchName,
            accountType: body.bankDetails.accountType,
            ...(body.bankDetails.qrUrl
              ? { qrUrl: body.bankDetails.qrUrl }
              : {}),
          },
        }
      );
    } else {
      await BankModel.create({
        accountHolderName: body.bankDetails.holderName,
        accountNumber: body.bankDetails.accountNumber,
        confirmAccountNumber: body.bankDetails.confirmAccountNumber,
        ifscCode: body.bankDetails.ifscCode,
        bankName: body.bankDetails.bankName,
        accountType: body.bankDetails.accountType,
        relationWithAccountHolder: body.bankDetails.relationWithAccountHolder,
        userId: params.userId,
        branchName: body.bankDetails.branchName,
        qrUrl: body.bankDetails.qrUrl,
      });
    }
  }

  /**
   * if kyc details exist , create or update the kyc details in the database
   */

  const kycDetailsExist = await BankModel.findOne({
    userId: params.userId,
  });

  if (body.kycDetails) {
    if (kycDetailsExist) {
      await KYCModel.findOneAndUpdate(
        {
          userId: params.userId,
        },
        {
          $set: {
            status: body.kycDetails.status,
            frontImage: body.kycDetails.frontImage,
            backImage: body.kycDetails.backImage,
            documentType: body.kycDetails.documentType,
            documentNumber: body.kycDetails.documentNumber,
          },
        }
      );
    } else {
      await KYCModel.create({
        status: 'pending',
        frontImage: body.kycDetails.frontImage,
        backImage: body.kycDetails.backImage,
        documentType: body.kycDetails.documentType,
        documentNumber: body.kycDetails.documentNumber,
        userId: params.userId,
      });
    }
  }

  return {
    status: 201,
    body: {
      success: true,
      message: 'User details updated successfully',
    },
  };
};
const verifyPromocode: AppRouteImplementationOrOptions<
  typeof userContract.verifyPromocode
> = async ({ params }) => {
  const UserExist = await UserModel.findOne({
    referralCode: params.promocode,
  });

  if (!UserExist) {
    return {
      status: 404,
      body: {
        success: false,
        message: 'Invalid promocode.',
      },
    };
  }
  return {
    status: 200,
    body: {
      email: UserExist.email,
      firstName: UserExist.firstName,
      lastName: UserExist.lastName || '',
      phoneNumber: UserExist.phoneNumber,
      referralCode: UserExist.referralCode || '',
    },
  };
};

const updatePassword: AppRouteImplementationOrOptions<
  typeof userContract.updatePassword
> = async ({ params, body }) => {
  try {
    const UserExist = await UserModel.findById(params.userId);

    if (!UserExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User not found',
        },
      };
    }

    const hashedPassword = await AuthService.hashPassword(body.password);

    await UserModel.findByIdAndUpdate(params.userId, {
      $set: {
        password: hashedPassword,
      },
    });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Password updated successfully',
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

export const userMutationHandler = {
  updateUserDetails,
  verifyPromocode,
  updatePassword,
};
