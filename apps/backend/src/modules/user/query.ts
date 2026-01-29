import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { UserModel } from '../../model/userModel';
import { KYCModel } from '../../model/kycModel';
import { affiliateBiometricModel } from '../../model/affiliateVerificationModel';
import { affiliateRequestModel } from '../../model/affiliateRequestModel';
import { methods } from '../../utils/methods';
import { CoursePaymentModel } from '../../model/coursePayment';
import { userContract } from '@srk/shared/contracts';
import { BankModel } from '../../model/bankModel';

export const getUserDetails: AppRouteImplementationOrOptions<
  typeof userContract.getUserDetails
> = async ({ params }) => {
  // Ensure `userDetails` is typed explicitly
  const userDetails = await UserModel.findById(params.userId).populate<{
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
  }>('packageId');

  const bankDetails = await BankModel.findOne({ userId: params.userId });
  const kycDetails = await KYCModel.findOne({ userId: params.userId });
  const affiliateBiometricDetails = await affiliateBiometricModel.findOne({
    userId: params.userId,
  });
  const affiliateRequestDetails = await affiliateRequestModel.findOne({
    userId: params.userId,
  });
  const coursePaymentDetails = await CoursePaymentModel.findOne({
    userId: params.userId,
  });
  if (!userDetails) {
    return {
      status: 404,
      body: {
        success: false,
        message: 'User not found',
      },
    };
  }
  const redirectionUrl = methods.getFrontendRedirectionUrl(
    false,
    userDetails.status,
    userDetails.packageId?._id?.toString()
  );

  return {
    status: 200,
    body: {
      userDetails: {
        _id: userDetails._id,
        country: userDetails.country,
        dob: userDetails.dob,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
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
      },
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
      redirectionUrl,
    },
  };
};

const getRefferedUsersByUserId: AppRouteImplementationOrOptions<
  typeof userContract.getRefferedUsersByUserId
> = async ({ params }) => {
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

  const referredUsers = await UserModel.find({
    referredBy: params.userId,
  });

  return {
    status: 200,
    body: referredUsers.map((user) => ({
      _id: user._id.toString(),
      country: user.country,
      dob: user.dob,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      gender: user.gender,
      referralCode: user.referralCode,
      referredAt: user.createdAt,
    })),
  };
};

const getAllUsers: AppRouteImplementationOrOptions<
  typeof userContract.getAllUsers
> = async ({ query }) => {
  try {
    const page = query?.page ? parseInt(query.page, 10) : 1;
    const limit = query?.limit ? parseInt(query.limit, 10) : 10;

    const queryReq: Record<string, any> = {};

    // Status array filter
    if (query?.status) {
      queryReq.status = { $in: query.status };
    }

    // Count total users matching filters
    const totalUsers = await UserModel.countDocuments(queryReq);

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get paginated users
    const users = await UserModel.find(queryReq)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate<{
        referredBy: {
          _id: string;
          firstName: string;
          lastName: string;
          referredBy: string;
        };
        packageId: {
          _id: string;
          title: string;
          description: string;
          price: number;
          discountedPrice: number;
        };
      }>({
        path: 'referredBy',
        populate: { path: 'referredBy', select: 'firstName lastName' }, // Further populating referredBy
      })
      .populate({
        path: 'packageId',
        select: 'title description price discountedPrice',
      })
      .sort({ createdAt: -1 });

    const formattedUsers = await Promise.all(
      users.map(async (user) => {
        const kycDetails = await KYCModel.findOne({ userId: user._id });
        const coursePaymentExist = await CoursePaymentModel.findOne({
          userId: user._id,
        });

        let seniorUser = null;
        if (user.referredBy?.referredBy) {
          seniorUser = await UserModel.findById(user.referredBy?.referredBy);
        }

        return {
          _id: user._id.toString(),
          country: user.country,
          dob: user.dob,
          email: user.email,
          firstName: user.firstName,
          isSelfSignup: !!user.isSelfSignup,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
          gender: user.gender,
          referralCode: user.referralCode,
          allowedToAddUsers: !!user.allowedToAddUsers,
          purpose: user.purpose || null,
          packageId: {
            _id: user.packageId?._id?.toString() || '',
            title: user.packageId?.title || '',
            description: user.packageId?.description || '',
            price: user.packageId?.price || null,
            discountedPrice: user.packageId?.discountedPrice || null,
          },
          referredAt: user.createdAt,
          isActive: user.status === 'PORTAL_ACTIVATED',
          courseEnrollAgreementUrl: kycDetails?.courseEnrollAgreement || '',
          referredBy: user.referredBy
            ? {
                _id: user.referredBy._id.toString(),
                firstName: user.referredBy.firstName,
                lastName: user.referredBy.lastName,
              }
            : null,
          seniorUser: seniorUser
            ? {
                _id: seniorUser._id.toString(),
                firstName: seniorUser.firstName,
                lastName: seniorUser.lastName,
              }
            : null,
          status: user.status,
          paymentDetails: coursePaymentExist
            ? {
                paymentProofUrl: coursePaymentExist.paymentProofUrl || '',
                transactionId: coursePaymentExist.transactionId || '',
                paymentType: coursePaymentExist.paymentType || '',
                paymentMethod: coursePaymentExist.paymentMethod || '',
              }
            : null,
          kycDetails: kycDetails
            ? {
                _id: kycDetails._id.toString(),
                status: kycDetails.status,
                rejectionReason: kycDetails.rejectionReason,
                frontImage: kycDetails.frontImage,
                backImage: kycDetails.backImage,
                documentType: kycDetails.documentType,
                documentNumber: kycDetails.documentNumber,
                verificationImage: kycDetails.verificationImage,
              }
            : null,
        };
      })
    );

    return {
      status: 200,
      body: {
        data: formattedUsers,
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
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

export const userQueryHandler = {
  getAllUsers,
  getUserDetails,
  getRefferedUsersByUserId,
};
