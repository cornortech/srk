import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { affiliateContract } from '@srk/shared/contracts';
import { affiliateRequestModel } from '../../model/affiliateRequestModel';
import { UserModel } from '../../model/userModel';
import { affiliateBiometricModel } from '../../model/affiliateVerificationModel';

const getAllAffiliateRequestsByStatus: AppRouteImplementationOrOptions<
  typeof affiliateContract.getAllAffiliateRequestsByStatus
> = async ({ query }) => {
  let { status } = query;

  status = status || [];

  try {
    const page = query?.page ? parseInt(query.page, 10) : 1;
    const limit = query?.limit ? parseInt(query.limit, 10) : 10;

    const queryReq: Record<string, any> = {
      status: {
        $in: status,
      },
    };

    // Add search functionality
    if (query?.search) {
      const searchRegex = new RegExp(query.search, 'i');
      queryReq.$or = [
        { 'userId.email': searchRegex },
        { 'userId.firstName': searchRegex },
        { 'userId.lastName': searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const affiliateRequests = await affiliateRequestModel
      .find({
        status: {
          $in: status,
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate<{
        userId: {
          _id: string;
          email: string;
          firstName: string;
          lastName: string;
          gender: string;
          profilePicture: string;
          phoneNumber: string;
        };
      }>('userId');

    // Filter results if search is provided (after population)
    let filteredRequests = affiliateRequests;
    if (query?.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filteredRequests = affiliateRequests.filter((request) => {
        return (
          searchRegex.test(request.userId?.email || '') ||
          searchRegex.test(request.userId?.firstName || '') ||
          searchRegex.test(request.userId?.lastName || '')
        );
      });
    }

    // Count total after filtering
    const totalRequest = query?.search
      ? filteredRequests.length
      : await affiliateRequestModel.countDocuments({
          status: { $in: status },
        });

    const formattedRequest = await Promise.all(
      filteredRequests.map(async (request) => {
        const affiliateBiometricData = await affiliateBiometricModel.findOne({
          userId: request.userId?._id,
        });

        return {
          userId: request.userId?._id.toString(),
          status: request.status,
          email: request.userId?.email,
          firstName: request.userId?.firstName,
          lastName: request.userId?.lastName,
          affiliateAgreementUrl: '',
          gender: request.userId?.gender,
          phoneNumber: request.userId?.phoneNumber,
          requestedAt: request.requestedAt,
          profilePicture: request.userId?.profilePicture,
          leftThumbPrint: affiliateBiometricData?.leftThumbPrint,
          rightThumbPrint: affiliateBiometricData?.rightThumbPrint,
          verificationImage: affiliateBiometricData?.verificationImage,
        };
      })
    );

    return {
      status: 200,
      body: {
        data: formattedRequest,
        page,
        limit,
        totalRequest,
        totalPages: Math.ceil(totalRequest / limit),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const getTeamsOfUser: AppRouteImplementationOrOptions<
  typeof affiliateContract.getTeamsOfUser
> = async ({ params }) => {
  try {
    const teams = await UserModel.find({
      referredBy: params.userId,
      status: {
        $in: [
          'REGISTERED',
          'PAYMENT_VERIFICATION_APPROVED',
          'KYC_VERIFICATION_PENDING',
          'KYC_VERIFICATION_REJECTED',
          'PORTAL_ACTIVATED',
          'PORTAL_DEACTIVATED',
        ],
      },
    }).populate<{
      packageId: {
        _id: string;
        title: string;
      };
    }>('packageId');

    return {
      status: 200,
      body: teams.map((team) => ({
        _id: team._id.toString(),
        country: team.country,
        dob: team.dob,
        email: team.email,
        firstName: team.firstName,
        lastName: team.lastName,
        phoneNumber: team.phoneNumber,
        profilePicture: team.profilePicture,
        createdAt: team.createdAt,
        gender: team.gender,
        purpose: team.purpose,
        packageName: team.packageId?.title,
      })),
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

export const affiliateQueryHandler = {
  getTeamsOfUser,
  getAllAffiliateRequestsByStatus,
};
