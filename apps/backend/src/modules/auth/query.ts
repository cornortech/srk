import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { authContract } from '../../contract/auth/contract';
import { UserModel } from '../../model/userModel';
import { BankModel } from '../../model/bankModel';
import { KYCModel } from '../../model/kycModel';
import { affiliateBiometricModel } from '../../model/affiliateVerificationModel';
import { affiliateRequestModel } from '../../model/affiliateRequestModel';
import { CoursePaymentModel } from '../../model/coursePayment';
import { methods } from '../../utils/methods';
import { TsRestAuthRequest } from '../../types/AuthRequest';
import { adminModel } from '../../model/adminModel';

const getUserProfile: AppRouteImplementationOrOptions<
  typeof authContract.getProfile
> = async ({ req }) => {
  const typedReq = req as TsRestAuthRequest;
  const reqUser = typedReq.user;
  const dbUser = typedReq.dbUser;
  const reqAdminDbUser = typedReq.adminDbUser;

  let userDetails = null;
  let bankDetails = null;
  let kycDetails = null;
  let affiliateBiometricDetails = null;
  let affiliateRequestDetails = null;
  let coursePaymentDetails = null;

  if (!dbUser && !reqAdminDbUser) {
    return {
      status: 401,
      body: {
        message: 'Unauthorized',
        success: false,
      },
    };
  }

  const role = reqAdminDbUser ? 'admin' : 'user';
  const userId = role === 'admin' ? reqAdminDbUser!._id : dbUser!._id;

  userDetails = await UserModel.findById(dbUser?._id).populate<{
    packageId: {
      _id: string;
      title: string;
      description: string;
      image: string;
      price: number;
      currency: string;
      features: string[];
      discountedPrice: number;
      created_at: Date;
      updated_at: Date;
    };
    srkBankId: {
      _id: string;
      accountNumber: string;
      status: string;
      amount: number;
    };
  }>([
    {
      path: 'packageId',
    },
    {
      path: 'srkBankId',
    },
  ]);

  const adminUser = await adminModel.findById(reqAdminDbUser?._id);

  bankDetails = await BankModel.findOne({ userId });
  kycDetails = await KYCModel.findOne({ userId });
  affiliateBiometricDetails = await affiliateBiometricModel.findOne({
    userId,
  });
  affiliateRequestDetails = await affiliateRequestModel.findOne({
    userId,
  });
  coursePaymentDetails = await CoursePaymentModel.findOne({
    userId,
  });

  if (!userDetails && !adminUser) {
    return {
      status: 404,
      body: {
        success: false,
        message: 'User not found',
      },
    };
  }

  const redirectionUrl = methods.getFrontendRedirectionUrl(
    role === 'admin',
    userDetails?.status,
    userDetails?.packageId?._id?.toString()
  );

  return {
    status: 200,
    body: {
      authDetails: {
        role: role,
        email:
          role === 'admin' ? adminUser?.email || '' : userDetails?.email || '',
        redirectionUrl: redirectionUrl,
      },
      srkBank: userDetails?.srkBankId
        ? {
            _id: userDetails.srkBankId._id?.toString() || null,
            accountNumber: userDetails.srkBankId?.accountNumber || null,
            status: userDetails.srkBankId?.status || null,
            amount: userDetails.srkBankId?.amount || 0,
          }
        : null,
      userDetails: userDetails
        ? {
            _id: userDetails._id,
            country: userDetails.country,
            dob: userDetails.dob,
            email: userDetails.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName || '',
            phoneNumber: userDetails.phoneNumber,
            profilePicture: userDetails.profilePicture,
            isActive: userDetails.status === 'PORTAL_ACTIVATED',
            referralCode: userDetails.referralCode,
            gender: userDetails.gender,
            affiliateEnabled: userDetails.affiliateEnabled,
            allowedToAddUsers: !!userDetails.allowedToAddUsers,
            createdAt: userDetails.createdAt,
            updatedAt: userDetails.updatedAt,
            status: userDetails.status,
            referredBy: userDetails.referredBy?.toString() || '',
            purpose: userDetails.purpose,
            packageId: {
              _id: userDetails.packageId._id,
              title: userDetails.packageId.title,
              description: userDetails.packageId.description,
              image: userDetails.packageId.image,
              price: userDetails.packageId.price,

              currency: userDetails.packageId.currency,
              features: userDetails.packageId.features,
              created_at: userDetails.packageId.created_at,
              updated_at: userDetails.packageId.updated_at,
              discountedPrice: userDetails?.packageId.discountedPrice || null,
            },
          }
        : null,
      paymentDetails: coursePaymentDetails
        ? {
            paymentMethod: coursePaymentDetails.paymentMethod || '',
            paymentProofUrl: coursePaymentDetails.paymentProofUrl || '',
            paymentType: coursePaymentDetails.paymentType || '',
            transactionId: coursePaymentDetails.transactionId || '',
            rejectionReason: coursePaymentDetails.rejectionReason || '',
          }
        : null,
      bankDetails: bankDetails
        ? {
            accountNumber: bankDetails.accountNumber,
            accountType: bankDetails.accountType,
            bankName: bankDetails.bankName,
            branchName: bankDetails.branchName,
            accountHolderName: bankDetails.accountHolderName,
            ifscCode: bankDetails.ifscCode || '',
            relationWithAccount: bankDetails.relationWithAccount,
            qrUrl: bankDetails.qrUrl || '',
            status: bankDetails.status,
            rejectionReason: bankDetails.rejectionReason,
          }
        : null,
      kycDetails: kycDetails
        ? {
            backImage: kycDetails.backImage,
            documentNumber: kycDetails.documentNumber,
            documentType: kycDetails.documentType,
            frontImage: kycDetails.frontImage,
            rejectionReason: kycDetails.rejectionReason,
            status: kycDetails.status,
            verificationImage: kycDetails.verificationImage,
          }
        : null,
      affiliateBiometricDetails: affiliateBiometricDetails
        ? {
            leftThumbPrint: affiliateBiometricDetails.leftThumbPrint,
            rightThumbPrint: affiliateBiometricDetails.rightThumbPrint,
            verificationImage: affiliateBiometricDetails.verificationImage,
          }
        : null,
      affiliateRequestDetails: affiliateRequestDetails
        ? {
            status: affiliateRequestDetails.status,
            rejectionReason: affiliateRequestDetails.rejectionReason,
            requestedAt: affiliateRequestDetails.requestedAt,
          }
        : null,
    },
  };
};

export const authQueryHandlers = {
  getUserProfile,
};
