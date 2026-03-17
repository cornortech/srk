import { growContract } from '@srk/shared/contracts';
import mongoose from 'mongoose';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { growSocialMediaPackageEnrollmentModel } from '../../model/growSocialMediaPackageEnrollment';
import { growSocialMediaPackagePaymentModel } from '../../model/growSocialMediaPackagePaymentModel';
import {
  GrowEnrollmentPopulated,
  GrowProfileResponsePopulated,
} from '../../utils/types/growQuery';
import { growPackageTodoModel } from '../../model/growPackageTodoModel';
import {
  growSocialMediaPackageUserModel,
  IGrowSocialMediaPackageUser,
} from '../../model/growSocialMediaPackageUserModel';
import { growSrkAffiliateVerificationModel } from '../../model/growSrkAffiliateVerificationModel';
import { IGrowSocialMediaPackage } from '../../model/growSocialMediaPackageModel';
import { IUser, UserModel } from '../../model/userModel';
import { GrowSrkAffiliateEarningPayoutModel } from '../../model/grow/growSrkAffiliateEarningPayoutModel';
import { growSrkAffiliateEarningStatementModel } from '../../model/grow/growSrkAffiliateEarningStatementModel';
import GrowAffiliateUserModel from '../../model/grow/growAffiliateUserModel';
import { growSrkAffiliateUserBalanceModel } from '../../model/grow/growSrkAffiliateUserBalanceModel';

export const getSrkGrowProfile: AppRouteImplementationOrOptions<
  typeof growContract.getSrkGrowProfile
> = async ({ params }) => {
  try {
    const { userId } = params;

    const packageUser = await growSocialMediaPackageUserModel
      .findById(userId)
      .populate<GrowProfileResponsePopulated['growSocialMediaPackageUser']>({
        path: 'referredBy',
        select: 'fullName',
      });

    if (!packageUser) {
      return {
        status: 404,
        body: {
          message: 'User not found',
        },
      };
    }

    const packageEnrollment = await growSocialMediaPackageEnrollmentModel
      .findOne({
        growSocialMediaPackageUserId: packageUser._id,
      })
      .populate<
        GrowProfileResponsePopulated['growSocialMediaPackageEnrollment']
      >([
        {
          path: 'growSocialMediaPackageId',
          select: 'name amount',
        },
        {
          path: 'growSocialMediaPackageTypeId',
          select: 'name',
        },
        {
          path: 'growSocialMediaPackageSubTypeId',
          select: 'name noOfLikes noOfVideos noOfFollowers',
        },
      ]);

    const packagePayment = packageEnrollment
      ? await growSocialMediaPackagePaymentModel.findOne({
          growPackageEnrollmentId: packageEnrollment._id,
        })
      : null;

    // Get engagement posts (like tasks) with their acquired counts
    const engagementPosts = packageEnrollment
      ? await growPackageTodoModel
          .find({
            growSocialMediaPackageEnrollmentId: packageEnrollment._id,
            type: 'like',
          })
          .lean()
      : [];

    // Get profile links (follow tasks) with their acquired counts
    const profileLinkTodos = packageEnrollment
      ? await growPackageTodoModel
          .find({
            growSocialMediaPackageEnrollmentId: packageEnrollment._id,
            type: 'follow',
          })
          .lean()
      : [];

    // Calculate referral statistics
    const totalReferrals = await growSocialMediaPackageUserModel.countDocuments(
      {
        referredBy: packageUser._id,
      }
    );

    const activeReferrals =
      await growSocialMediaPackageUserModel.countDocuments({
        referredBy: packageUser._id,
        status: 'portalActivated',
      });

    // Calculate analytics for engagement posts (likes)
    const likesTarget =
      packageEnrollment?.growSocialMediaPackageSubTypeId?.noOfLikes || 0;
    const numberOfVideos =
      packageEnrollment?.growSocialMediaPackageSubTypeId?.noOfVideos || 0;

    const engagementPostsWithAnalytics = engagementPosts.map((post) => {
      const likesAcquired = post.likeCounts || 0;
      const progress =
        likesTarget > 0 ? Math.round((likesAcquired / likesTarget) * 100) : 0;
      return {
        url: post.postUrl || '',
        likesAcquired,
        likesTarget,
        progress,
      };
    });

    // Calculate analytics for profile links (followers)
    const followersTarget =
      packageEnrollment?.growSocialMediaPackageSubTypeId?.noOfFollowers || 0;

    const profileLinksWithAnalytics = profileLinkTodos.map((profile) => {
      const followersAcquired = profile.followCounts || 0;
      const progress =
        followersTarget > 0
          ? Math.round((followersAcquired / followersTarget) * 100)
          : 0;
      return {
        url: profile.profileUrl || '',
        followersAcquired,
        followersTarget,
        progress,
      };
    });

    // Calculate overall analytics summary
    const totalLikesAcquired = engagementPosts.reduce(
      (sum, post) => sum + (post.likeCounts || 0),
      0
    );
    const totalLikesTarget = likesTarget * numberOfVideos;
    const likesProgress =
      totalLikesTarget > 0
        ? Math.round((totalLikesAcquired / totalLikesTarget) * 100)
        : 0;

    const totalFollowersAcquired = profileLinkTodos.reduce(
      (sum, profile) => sum + (profile.followCounts || 0),
      0
    );
    const totalFollowersTarget = followersTarget * profileLinkTodos.length;
    const followersProgress =
      totalFollowersTarget > 0
        ? Math.round((totalFollowersAcquired / totalFollowersTarget) * 100)
        : 0;

    // Calculate overall progress (weighted average)
    const overallProgress =
      totalLikesTarget > 0 || totalFollowersTarget > 0
        ? Math.round(
            ((totalLikesAcquired + totalFollowersAcquired) /
              (totalLikesTarget + totalFollowersTarget)) *
              100
          )
        : 0;

    return {
      status: 200,
      body: {
        userDetails: {
          _id: packageUser._id.toString(),
          srkUniversityId: packageUser.srkUniversityUserId?.toString(),
          fullName: packageUser.fullName,
          email: packageUser.email,
          status: packageUser.status,
          phone: packageUser.phone,
          kycURL: packageUser.kycURL,
          country: packageUser.country,
          gender: packageUser.gender,
          promoCode: packageUser.promoCode,

          profileLinkURL:
            profileLinkTodos?.map((profile) => profile.profileUrl) ?? [],

          // Enhanced profile details
          totalReferrals,
          activeReferrals,

          referredBy: packageUser.referredBy
            ? {
                name: packageUser.referredBy.fullName,
              }
            : null,
          createdAt: packageUser.createdAt.toISOString(),
        },

        enrollmentData: packageEnrollment
          ? {
              _id: packageEnrollment._id.toString(),
              isActive: packageEnrollment.isActive,
              enrollmentPackageDetails: {
                name: packageEnrollment.growSocialMediaPackageId.name,
                amount: packageEnrollment.growSocialMediaPackageId.amount,
                socialMediaPlatform: packageEnrollment.socialMediaPlatform,
                packageType: {
                  name: packageEnrollment.growSocialMediaPackageTypeId.name,

                  packageSubType: {
                    name: packageEnrollment.growSocialMediaPackageSubTypeId
                      .name,
                    noOfLikes:
                      packageEnrollment.growSocialMediaPackageSubTypeId
                        .noOfLikes,
                    noOfVideos:
                      packageEnrollment.growSocialMediaPackageSubTypeId
                        .noOfVideos,
                    noOfFollowers:
                      packageEnrollment.growSocialMediaPackageSubTypeId
                        .noOfFollowers,
                  },
                },
              },

              // Enhanced engagement data with acquired/total counts
              engagementPostURLs: engagementPostsWithAnalytics,

              // Enhanced profile links data
              profileLinks: profileLinksWithAnalytics,

              // Overall analytics summary
              analytics: {
                totalFollowersAcquired,
                totalFollowersTarget,
                followersProgress,
                totalLikesAcquired,
                totalLikesTarget,
                likesProgress,
                overallProgress,
              },

              enrollmentPaymentDetails: packagePayment
                ? {
                    paymentUrl: packagePayment.paymentURL,
                    transactionId: packagePayment.transactionId,
                    paymentMethod: packagePayment.paymentMethod,
                    rejectionReason: packagePayment.rejectionReason ?? null,
                  }
                : null,
            }
          : null,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        message: 'Internal server error',
      },
    };
  }
};

const getAllSrkGrowEnrollmentUser: AppRouteImplementationOrOptions<
  typeof growContract.getAllGrowSocialMediaEnrollement
> = async ({ query }) => {
  try {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);

    const queryReq: Record<string, any> = {};

    const totalUsers =
      await growSocialMediaPackageEnrollmentModel.countDocuments(queryReq);

    const enrollments = await growSocialMediaPackageEnrollmentModel
      .find(queryReq)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate<GrowEnrollmentPopulated>('growSocialMediaPackageUserId')
      .populate<GrowEnrollmentPopulated>('growSocialMediaPackageId')
      .populate<GrowEnrollmentPopulated>('growSocialMediaPackageTypeId')
      .populate<GrowEnrollmentPopulated>('growSocialMediaPackageSubTypeId')
      .sort({ createdAt: -1 });

    const packageEnrollment = await Promise.all(
      enrollments.map(async (e) => {
        const postEngagement = await growPackageTodoModel.find({
          growSocialMediaPackageEnrollmentId: e._id,
          type: 'like',
        });

        const growPackageTodos = await growPackageTodoModel.find({
          growSocialMediaPackageEnrollmentId: e._id,
          type: 'follow',
        });

        const profileLinkURLs =
          growPackageTodos?.map((profile) => profile.profileUrl) ?? undefined;

        // Fetch payment data for this enrollment
        const paymentData = await growSocialMediaPackagePaymentModel.findOne({
          growPackageEnrollmentId: e._id,
        });

        return {
          _id: e._id.toString(),
          userData: {
            fullName: e.growSocialMediaPackageUserId.fullName,
            email: e.growSocialMediaPackageUserId.email,
            gender: e.growSocialMediaPackageUserId.gender,
            phoneNumber: e.growSocialMediaPackageUserId.phoneNumber,
            country: e.growSocialMediaPackageUserId.country,
            kycURL: e.growSocialMediaPackageUserId.kycURL,
            usedPromoCode:
              e.growSocialMediaPackageUserId.usedPromoCode ?? undefined,
            status: e.growSocialMediaPackageUserId.status,
          },

          enrollmentData: {
            growSocialMediaPackageId: e.growSocialMediaPackageId._id.toString(),
            growSocialMediaPackageTypeId:
              e.growSocialMediaPackageTypeId._id.toString(),
            growSocialMediaPackageSubTypeId:
              e.growSocialMediaPackageSubTypeId._id.toString(),
            profileLinkURL: profileLinkURLs ? profileLinkURLs : [],
            isActive: e.isActive ?? false,
            packageName: e.growSocialMediaPackageId?.name ?? 'Unknown',
            packageTypeName: e.growSocialMediaPackageTypeId?.name ?? 'Unknown',
            packageSubTypeName:
              e.growSocialMediaPackageSubTypeId?.name ?? 'Unknown',
            socialMediaPlatform: e.socialMediaPlatform ?? 'Unknown',
            noOfFollowers:
              e.growSocialMediaPackageSubTypeId?.noOfFollowers ?? 0,
            noOfLikes: e.growSocialMediaPackageSubTypeId?.noOfLikes ?? 0,
            noOfVideos: e.noOfVideos ?? 0,
          },

          postEngagement: {
            postURLs: postEngagement?.map((post) => post.postUrl) ?? [],
          },

          paymentData: {
            paymentMethod: paymentData?.paymentMethod ?? ('esewa' as const),
            paymentURL: paymentData?.paymentURL ?? '',
            transactionId: paymentData?.transactionId ?? '',
            rejectionReason: paymentData?.rejectionReason ?? '',
          },
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
        };
      })
    );

    return {
      status: 200,
      body: {
        data: packageEnrollment,
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const getSrkGrowEnrollmentUserById: AppRouteImplementationOrOptions<
  typeof growContract.getGrowSocialMediaEnrollmentById
> = async ({ params }) => {
  try {
    const enrollment = await growSocialMediaPackageEnrollmentModel
      .findById(params.enrollmentID)
      .populate<GrowEnrollmentPopulated>('growSocialMediaPackageUserId')
      .populate<GrowEnrollmentPopulated>('growSocialMediaPackageId')
      .populate<GrowEnrollmentPopulated>('growSocialMediaPackageTypeId')
      .populate<GrowEnrollmentPopulated>('growSocialMediaPackageSubTypeId');

    if (!enrollment) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Enrollment not found',
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: enrollment._id.toString(),
        userData: {
          _id: enrollment.growSocialMediaPackageUserId._id,
          fullName: enrollment.growSocialMediaPackageUserId.fullName,
          email: enrollment.growSocialMediaPackageUserId.email,
          phoneNumber: enrollment.growSocialMediaPackageUserId.phoneNumber,
          country: enrollment.growSocialMediaPackageUserId.country,
          gender: enrollment.growSocialMediaPackageUserId.gender,
          kycURL: enrollment.growSocialMediaPackageUserId.kycURL,
        },

        enrollementData: {
          package: {
            _id: enrollment.growSocialMediaPackageId._id,
            title:
              enrollment.growSocialMediaPackageId.title ??
              enrollment.growSocialMediaPackageId.name ??
              'Unknown',
            price:
              enrollment.growSocialMediaPackageId.price ??
              enrollment.growSocialMediaPackageId.amount ??
              0,
          },
          packageType: {
            _id: enrollment.growSocialMediaPackageTypeId._id,
            title:
              enrollment.growSocialMediaPackageTypeId.title ??
              enrollment.growSocialMediaPackageTypeId.name ??
              'Unknown',
          },
          packageSubType: {
            _id: enrollment.growSocialMediaPackageSubTypeId._id,
            title:
              enrollment.growSocialMediaPackageSubTypeId.title ??
              enrollment.growSocialMediaPackageSubTypeId.name ??
              'Unknown',
          },
          // profileLinkURL: enrollment.profileLinkURL && enrollment.profileLinkURL[0],
          profileLinkURL: enrollment.profileLinkURL,
          isActive: enrollment.isActive,
        },

        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const getAllSrkGrowUsers: AppRouteImplementationOrOptions<
  typeof growContract.getAllSrkGrowUsers
> = async ({ query }) => {
  try {
    const { search, page: pageStr, limit: limitStr } = query || {};
    const page = Number(pageStr ?? 1);
    const limit = Number(limitStr ?? 10);

    let enrollmentFilter: Record<string, unknown> = {};

    if (search) {
      // First, get users matching the search
      const users = await growSocialMediaPackageUserModel
        .find({
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        })
        .select('_id')
        .lean();

      const userIds = users.map((u) => u._id);

      // If no users found, return empty with pagination
      if (userIds.length === 0) {
        return {
          status: 200,
          body: {
            data: [],
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        };
      }

      enrollmentFilter = {
        growSocialMediaPackageUserId: { $in: userIds },
      };
    }

    const total = await growSocialMediaPackageEnrollmentModel.countDocuments(
      enrollmentFilter
    );
    const totalPages = Math.ceil(total / limit);

    type PopulatedUser = Pick<
      IGrowSocialMediaPackageUser,
      'fullName' | 'email' | 'status' | 'createdAt'
    > & {
      _id: mongoose.Types.ObjectId;
      referredBy?: Pick<IGrowSocialMediaPackageUser, 'fullName'> & {
        _id: mongoose.Types.ObjectId;
      };
    };

    type PopulatedPackage = Pick<IGrowSocialMediaPackage, 'name'> & {
      _id: mongoose.Types.ObjectId;
    };

    type PopulatedEnrollment = {
      _id: mongoose.Types.ObjectId;
      growSocialMediaPackageUserId: PopulatedUser;
      growSocialMediaPackageId: PopulatedPackage;
      type: string;
      createdAt: Date;
    };

    const usersLists = (await growSocialMediaPackageEnrollmentModel
      .find(enrollmentFilter)
      .populate<{ growSocialMediaPackageUserId: PopulatedUser }>({
        path: 'growSocialMediaPackageUserId',
        select: 'fullName email referredBy status createdAt',
        populate: {
          path: 'referredBy',
          select: 'fullName',
        },
      })
      .populate<{ growSocialMediaPackageId: PopulatedPackage }>({
        path: 'growSocialMediaPackageId',
        select: 'name',
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()) as unknown as PopulatedEnrollment[];

    return {
      status: 200,
      body: {
        data: usersLists.map((u) => ({
          _id: u.growSocialMediaPackageUserId._id.toString(),
          fullName: u.growSocialMediaPackageUserId.fullName,
          email: u.growSocialMediaPackageUserId.email,
          referredBy:
            u.growSocialMediaPackageUserId.referredBy?.fullName ?? null,
          status: u.growSocialMediaPackageUserId.status,
          enrollmentType: u.type,
          createdAt: u.createdAt.toISOString(),
          socialMediaPackage: {
            _id: u.growSocialMediaPackageId._id.toString(),
            name: u.growSocialMediaPackageId.name,
          },
        })),
        page,
        limit,
        total,
        totalPages,
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

const getAllSrkGrowAffiliateVerificationRequest: AppRouteImplementationOrOptions<
  typeof growContract.getAllSrkGrowAffiliateVerificationRequest
> = async ({ query }) => {
  try {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const status = query?.status;

    const filter: any = {};
    if (status?.length) {
      filter.status = { $in: status };
    }

    const totalUsers = await growSrkAffiliateVerificationModel.countDocuments(
      filter
    );

    const totalPages = Math.ceil(totalUsers / limit);

    const data = await growSrkAffiliateVerificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate<{
        srkUniversityUserId: Pick<
          IUser,
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
        select: '-password',
      })
      .lean();

    return {
      status: 200,
      body: {
        data: data.map((d) => ({
          _id: d._id.toString(),
          username: `${d.srkUniversityUserId.firstName} ${d.srkUniversityUserId.lastName}`,
          email: d.srkUniversityUserId.email,
          status: d.status,
          verificationImageUrl: d.verificationImageUrl,
          verificationRequestId: d._id.toString(),
          createdAt: d.createdAt.toLocaleString(),
          gender: d.srkUniversityUserId.gender,
          country: d.srkUniversityUserId.country,
          phoneNumber: d.srkUniversityUserId.phoneNumber,
          profilePicture: d.srkUniversityUserId.profilePicture,
          rejectionReason: d.rejectionReason,
        })),
        page,
        limit,
        totalUsers,
        totalPages,
      },
    };
  } catch (error: any) {
    console.error(error);
    return {
      status: 500,
      body: {
        message: error.message
          ? `Internal server error: ${error.message}`
          : 'Internal server error',
      },
    };
  }
};

const getAllSrkGrowAffiliateUsers: AppRouteImplementationOrOptions<
  typeof growContract.getAllSrkGrowAffiliateUsers
> = async ({ query }) => {
  try {
    const { search, page: pageStr, limit: limitStr } = query || {};
    const page = Number(pageStr ?? 1);
    const limit = Number(limitStr ?? 10);

    const affiliateFilter: Record<string, unknown> = {};

    if (search) {
      affiliateFilter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await GrowAffiliateUserModel.countDocuments(affiliateFilter);
    const totalPages = Math.ceil(total / limit);

    const affiliateUsers = await GrowAffiliateUserModel.find(affiliateFilter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get wallet balance and referral counts for each affiliate
    const affiliateUsersWithData = await Promise.all(
      affiliateUsers.map(async (affiliate) => {
        // Get wallet balance
        const walletBalance = await growSrkAffiliateUserBalanceModel
          .findOne({ growAffiliateUserId: affiliate._id })
          .select('wallet')
          .lean();

        // Count total referrals (from earning statements)
        const totalReferrals =
          await growSrkAffiliateEarningStatementModel.countDocuments({
            refferedBy: affiliate._id,
          });

        return {
          _id: affiliate._id.toString(),
          fullName: affiliate.fullName,
          email: affiliate.email,
          status: 'portalActivated', // Default status for affiliates
          createdAt: affiliate.createdAt.toISOString(),
          walletBalance: walletBalance?.wallet ?? 0,
          totalReferrals: totalReferrals,
        };
      })
    );

    return {
      status: 200,
      body: {
        data: affiliateUsersWithData,
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message:
          error instanceof Error ? error.message : 'Internal server error',
      },
    };
  }
};

// Affiliate Earning Payout Query Handlers
const getSrkGrowAffiliateEarningPayoutRequestByAdmin: AppRouteImplementationOrOptions<
  typeof growContract.getSrkGrowAffiliateEarningPayoutRequestByAdmin
> = async ({ query }) => {
  try {
    const { page = 1, limit = 10, status } = query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    // Get payouts with pagination
    const [payouts, total] = await Promise.all([
      GrowSrkAffiliateEarningPayoutModel.find(filter)
        .populate({
          path: 'srkGrowUserId',
          select: '_id fullName email phoneNumber',
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      GrowSrkAffiliateEarningPayoutModel.countDocuments(filter),
    ]);

    // Format response
    const formattedPayouts = payouts.map((payout: any) => ({
      _id: payout._id.toString(),
      srkGrowUser: payout.srkGrowUserId
        ? {
            _id: payout.srkGrowUserId._id.toString(),
            fullName: payout.srkGrowUserId.fullName,
            email: payout.srkGrowUserId.email,
            phoneNumber: payout.srkGrowUserId.phoneNumber,
          }
        : null,
      amount: payout.amount,
      status: payout.status,
      transactionId: payout.transactionId,
      paymentUrl: payout.paymentUrl,
      rejectionReason: payout.rejectionReason,
      paidAt: payout.paidAt,
      createdAt: payout.createdAt,
      updatedAt: payout.updatedAt,
    }));

    return {
      status: 200,
      body: {
        data: formattedPayouts,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalItems: total,
          itemsPerPage: limitNum,
        },
      },
    };
  } catch (error: any) {
    console.error('Error fetching payout requests by admin:', error);
    return {
      status: 500,
      body: {
        message: 'Failed to fetch payout requests',
      },
    };
  }
};

const getSrkGrowAffiliateEarningPayoutRequestByUser: AppRouteImplementationOrOptions<
  typeof growContract.getSrkGrowAffiliateEarningPayoutRequestByUser
> = async ({ params, query }) => {
  try {
    const { userId } = params;
    const { page = 1, limit = 10 } = query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Validate user exists
    const growAffiliateUser = await GrowAffiliateUserModel.findById(userId);

    if (!growAffiliateUser) {
      return {
        status: 404,
        body: {
          message: 'User not found',
        },
      };
    }

    // Get payouts with pagination
    const [payouts, total] = await Promise.all([
      GrowSrkAffiliateEarningPayoutModel.find({ srkGrowUserId: userId })
        .populate({
          path: 'srkGrowUserId',
          select: '_id fullName email phoneNumber',
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      GrowSrkAffiliateEarningPayoutModel.countDocuments({
        srkGrowUserId: userId,
      }),
    ]);

    // Format response
    const formattedPayouts = payouts.map((payout: any) => ({
      _id: payout._id.toString(),
      srkGrowUser: payout.srkGrowUserId
        ? {
            _id: payout.srkGrowUserId._id.toString(),
            fullName: payout.srkGrowUserId.fullName,
            email: payout.srkGrowUserId.email,
            phoneNumber: payout.srkGrowUserId.phoneNumber,
          }
        : null,
      amount: payout.amount,
      status: payout.status,
      transactionId: payout.transactionId,
      paymentUrl: payout.paymentUrl,
      rejectionReason: payout.rejectionReason,
      paidAt: payout.paidAt,
      createdAt: payout.createdAt,
      updatedAt: payout.updatedAt,
    }));

    return {
      status: 200,
      body: {
        data: formattedPayouts,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalItems: total,
          itemsPerPage: limitNum,
        },
      },
    };
  } catch (error: any) {
    console.error('Error fetching payout requests by user:', error);
    return {
      status: 500,
      body: {
        message: 'Failed to fetch payout requests',
      },
    };
  }
};

const getSrkGrowAffiliateVerificationRequest: AppRouteImplementationOrOptions<
  typeof growContract.getSrkGrowAffiliateVerificationRequest
> = async ({ query }) => {
  try {
    const srkUniversityUserId = query.srkUniversityUserId;

    // check if srk university user exist wth this id

    const srkUniversityUserExist = await UserModel.findById(
      srkUniversityUserId
    );

    if (!srkUniversityUserExist) {
      return {
        status: 403,
        body: {
          success: false,
          message: "Srk university user doesn't exist.",
        },
      };
    }

    const srkAffiliateVerificationExist =
      await growSrkAffiliateVerificationModel
        .findOne({
          srkUniversityUserId,
        })
        .populate<{
          srkUniversityUserId: Pick<IUser, 'firstName' | 'lastName' | 'email'>;
        }>({
          path: 'srkUniversityUserId',
          select: 'firstName lastName email',
        })
        .lean();

    if (!srkAffiliateVerificationExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Affiliate verification request not found',
        },
      };
    }

    console.log(
      'Found affiliate verification request:',
      srkAffiliateVerificationExist
    );

    // ✅ Check for affiliate user (approved affiliates are created in GrowAffiliateUserModel)
    const growAffiliateUserExist = await GrowAffiliateUserModel.findOne({
      srkUniversityUserId,
    }).lean();

    return {
      status: 200,
      body: {
        affiliateVerificationRequest: {
          _id: srkAffiliateVerificationExist._id.toString(),
          verificationRequestId: srkAffiliateVerificationExist._id.toString(),
          username: `${srkAffiliateVerificationExist.srkUniversityUserId.firstName} ${srkAffiliateVerificationExist.srkUniversityUserId.lastName}`,
          email: srkAffiliateVerificationExist.srkUniversityUserId.email,
          verificationImageUrl:
            srkAffiliateVerificationExist.verificationImageUrl,
          createdAt: srkAffiliateVerificationExist.createdAt.toISOString(),
          status: srkAffiliateVerificationExist.status,
          rejectionReason: srkAffiliateVerificationExist.rejectionReason,
        },
        affiliateUser: growAffiliateUserExist
          ? {
              _id: growAffiliateUserExist._id.toString(),
              fullName: growAffiliateUserExist.fullName,
              email: growAffiliateUserExist.email,
              gender: growAffiliateUserExist.gender,
              promocode: growAffiliateUserExist.promocode,
              srkUniversityUserId:
                growAffiliateUserExist.srkUniversityUserId?.toString(),
              isActive: growAffiliateUserExist.isActive,
              createdAt: growAffiliateUserExist.createdAt.toISOString(),
              updatedAt: growAffiliateUserExist.updatedAt.toISOString(),
            }
          : null,
      },
    };
  } catch (error: any) {
    console.log('Error in affiliate verification check:', error);
    return {
      status: 500,
      body: {
        message: 'Internal server error',
        success: false,
      },
    };
  }
};

const getTaskMonitoring: AppRouteImplementationOrOptions<
  typeof growContract.getTaskMonitoring
> = async ({ query }) => {
  try {
    const { search = '' } = query || {};

    // Build user filter based on search
    const userFilter: any = {};

    if (search) {
      userFilter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    // Get all package users (not affiliates)
    const users = await growSocialMediaPackageUserModel
      .find(userFilter)
      .select('_id fullName email status')
      .lean();

    if (users.length === 0) {
      return {
        status: 200,
        body: [],
      };
    }

    const userIds = users.map((u) => u._id);

    // Get enrollments for these users
    const enrollments = await growSocialMediaPackageEnrollmentModel
      .find({
        growSocialMediaPackageUserId: { $in: userIds },
      })
      .populate('growSocialMediaPackageId', 'name')
      .populate(
        'growSocialMediaPackageSubTypeId',
        'name noOfLikes noOfFollowers'
      )
      .lean();

    // Build result array
    const taskMonitoringData = await Promise.all(
      enrollments.map(async (enrollment: any) => {
        const user = users.find(
          (u) =>
            u._id.toString() ===
            enrollment.growSocialMediaPackageUserId.toString()
        );

        if (!user) return null;

        // Get todo tasks for this enrollment
        const todos = await growPackageTodoModel
          .find({
            growSocialMediaPackageEnrollmentId: enrollment._id,
          })
          .lean();

        // Calculate task completion
        const followTasks = todos.filter((t) => t.type === 'follow');
        const likeTasks = todos.filter((t) => t.type === 'like');

        const requiredFollows =
          enrollment.growSocialMediaPackageSubTypeId?.noOfFollowers || 0;
        const requiredLikes =
          enrollment.growSocialMediaPackageSubTypeId?.noOfLikes || 0;

        const completedFollows = followTasks.reduce(
          (sum, task) => sum + task.followCounts,
          0
        );
        const completedLikes = likeTasks.reduce(
          (sum, task) => sum + task.likeCounts,
          0
        );

        const followPercentage =
          requiredFollows > 0
            ? Math.min(
                100,
                Math.round((completedFollows / requiredFollows) * 100)
              )
            : 0;

        const likePercentage =
          requiredLikes > 0
            ? Math.min(100, Math.round((completedLikes / requiredLikes) * 100))
            : 0;

        // Get individual video details for like tasks
        const noOfVideos = enrollment.noOfVideos || likeTasks.length;
        const likesPerVideo =
          noOfVideos > 0
            ? Math.ceil(requiredLikes / noOfVideos)
            : requiredLikes;

        const videos = likeTasks.map((task) => ({
          postUrl: task.postUrl || '',
          profileUrl: task.profileUrl || '',
          likeCounts: task.likeCounts || 0,
          totalRequired: likesPerVideo,
          percentage:
            likesPerVideo > 0
              ? Math.min(
                  100,
                  Math.round((task.likeCounts / likesPerVideo) * 100)
                )
              : 0,
        }));

        // Get profile details for follow tasks
        const followsPerProfile =
          followTasks.length > 0
            ? Math.ceil(requiredFollows / followTasks.length)
            : requiredFollows;
        const profiles = followTasks.map((task) => ({
          profileUrl: task.profileUrl || '',
          followCounts: task.followCounts || 0,
          totalRequired: followsPerProfile,
          percentage:
            followsPerProfile > 0
              ? Math.min(
                  100,
                  Math.round((task.followCounts / followsPerProfile) * 100)
                )
              : 0,
        }));

        // Calculate overall completion percentage
        let overallPercentage = 0;
        let taskCount = 0;

        if (requiredFollows > 0) {
          overallPercentage += followPercentage;
          taskCount++;
        }
        if (requiredLikes > 0) {
          overallPercentage += likePercentage;
          taskCount++;
        }

        overallPercentage =
          taskCount > 0 ? Math.round(overallPercentage / taskCount) : 0;

        return {
          _id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          status: user.status,
          enrollmentId: enrollment._id.toString(),
          platform: enrollment.socialMediaPlatform,
          packageName: enrollment.growSocialMediaPackageId?.name || 'Unknown',
          packageSubTypeName:
            enrollment.growSocialMediaPackageSubTypeId?.name || 'Unknown',
          tasks: {
            follow: {
              total: requiredFollows,
              completed: completedFollows,
              percentage: followPercentage,
            },
            like: {
              total: requiredLikes,
              completed: completedLikes,
              percentage: likePercentage,
            },
            videos: videos.length > 0 ? videos : undefined,
            profiles: profiles.length > 0 ? profiles : undefined,
          },
          overallCompletionPercentage: overallPercentage,
          isActive: enrollment.isActive || false,
          createdAt:
            enrollment.createdAt?.toISOString() || new Date().toISOString(),
        };
      })
    );

    // Filter out nulls and sort by completion percentage
    const filteredData = taskMonitoringData
      .filter((data) => data !== null)
      .sort(
        (a, b) => b.overallCompletionPercentage - a.overallCompletionPercentage
      );

    return {
      status: 200,
      body: filteredData,
    };
  } catch (error: any) {
    console.error('Error in getTaskMonitoring:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || 'Internal server error',
      },
    };
  }
};

export const getGlobalOverview: AppRouteImplementationOrOptions<
  typeof growContract.getGlobalOverview
> = async ({ query }) => {
  try {
    const timeRange = query?.timeRange || '6months';

    // Calculate date range based on filter
    let startDate: Date | undefined;

    if (timeRange === '6months') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (timeRange === '1year') {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    // 'all' means no date filter (startDate remains undefined)

    // Calculate total revenue from enrollments (filtered by date if applicable)
    const revenueMatch: Record<string, unknown> = startDate
      ? { createdAt: { $gte: startDate } }
      : {};
    const revenueResult = await growSocialMediaPackageEnrollmentModel.aggregate(
      [
        { $match: revenueMatch },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
          },
        },
      ]
    );
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Calculate total liability from affiliate earning statements (filtered by date if applicable)
    const liabilityMatch: Record<string, unknown> = startDate
      ? { createdAt: { $gte: startDate } }
      : {};
    const liabilityResult =
      await growSrkAffiliateEarningStatementModel.aggregate([
        { $match: liabilityMatch },
        {
          $group: {
            _id: null,
            totalLiability: { $sum: '$amount' },
          },
        },
      ]);
    const totalLiability = liabilityResult[0]?.totalLiability || 0;

    // Count active affiliates
    const affiliateCount = await growSocialMediaPackageUserModel.countDocuments(
      {
        userType: 'affiliate',
        status: 'portalActivated',
      }
    );

    // Get monthly trends based on time range
    const monthsToShow =
      timeRange === '1year' ? 12 : timeRange === '6months' ? 6 : 24; // 24 for 'all' (last 2 years)
    const trendsStartDate = new Date();
    trendsStartDate.setMonth(trendsStartDate.getMonth() - monthsToShow);

    // Revenue trends
    const revenueTrends = await growSocialMediaPackageEnrollmentModel.aggregate(
      [
        {
          $match: {
            createdAt: { $gte: trendsStartDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            revenue: { $sum: '$amount' },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ]
    );

    // User trends
    const userTrends = await growSocialMediaPackageUserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: trendsStartDate },
          userType: 'package',
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          users: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Merge trends and format
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const trendsArray: Array<{
      month: string;
      revenue: number;
      users: number;
      sortKey: string;
    }> = [];

    // Initialize months based on time range (oldest to newest)
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      trendsArray.push({
        month: monthNames[date.getMonth()],
        revenue: 0,
        users: 0,
        sortKey: key,
      });
    }

    // Fill in revenue data
    revenueTrends.forEach((trend) => {
      const key = `${trend._id.year}-${trend._id.month}`;
      const trendData = trendsArray.find((t) => t.sortKey === key);
      if (trendData) {
        trendData.revenue = Math.round(trend.revenue / 1000); // Convert to K
      }
    });

    // Fill in user data
    userTrends.forEach((trend) => {
      const key = `${trend._id.year}-${trend._id.month}`;
      const trendData = trendsArray.find((t) => t.sortKey === key);
      if (trendData) {
        trendData.users = trend.users;
      }
    });

    // Remove sortKey and reverse to show newest first (current month at top)
    const trends = trendsArray
      .map(({ month, revenue, users }) => ({
        month,
        revenue,
        users,
      }))
      .reverse();

    return {
      status: 200,
      body: {
        totalRevenue,
        totalLiability,
        affiliateCount,
        trends,
      },
    };
  } catch (error: any) {
    console.error('Error in getGlobalOverview:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || 'Internal server error',
      },
    };
  }
};

const getGrowAffiliateUser: AppRouteImplementationOrOptions<
  typeof growContract.getGrowAffiliateUser
> = async ({ params }) => {
  try {
    const { userId } = params;

    // Get affiliate user details
    const affiliateUser = await GrowAffiliateUserModel.findById(userId).lean();

    if (!affiliateUser) {
      return {
        status: 404,
        body: {
          message: 'Affiliate user not found',
        },
      };
    }

    // Get wallet balance
    const walletData = await growSrkAffiliateUserBalanceModel
      .findOne({ growAffiliateUserId: affiliateUser._id })
      .lean();

    const walletBalance = walletData?.wallet || 0;

    // Get total earnings
    const totalEarnings = await growSrkAffiliateEarningStatementModel.aggregate(
      [
        { $match: { refferedBY: affiliateUser._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]
    );

    // Get referral statistics
    const totalReferrals = await growSocialMediaPackageUserModel.countDocuments(
      {
        referredBy: affiliateUser._id,
      }
    );

    const activeReferrals =
      await growSocialMediaPackageUserModel.countDocuments({
        referredBy: affiliateUser._id,
        status: 'portalActivated',
      });

    const totalPayouts = await GrowSrkAffiliateEarningPayoutModel.aggregate([
      {
        $match: {
          growAffiliateUserId: affiliateUser._id,
          status: 'approved',
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const pendingPayouts = await GrowSrkAffiliateEarningPayoutModel.aggregate([
      {
        $match: {
          growAffiliateUserId: affiliateUser._id,
          status: 'pending',
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return {
      status: 200,
      body: {
        _id: affiliateUser._id.toString(),
        fullName: affiliateUser.fullName,
        email: affiliateUser.email,
        gender: affiliateUser.gender,
        promocode: affiliateUser.promocode,
        srkUniversityUserId: affiliateUser.srkUniversityUserId?.toString(),
        walletBalance,
        totalEarnings: totalEarnings[0]?.total || 0,
        totalReferrals,
        activeReferrals,
        totalPayouts: totalPayouts[0]?.total || 0,
        pendingPayouts: pendingPayouts[0]?.total || 0,
        createdAt: affiliateUser.createdAt.toISOString(),
        updatedAt: affiliateUser.updatedAt.toISOString(),
      },
    };
  } catch (error: any) {
    console.error('Error in getGrowAffiliateUser:', error);
    return {
      status: 500,
      body: {
        message: error.message || 'Internal server error',
      },
    };
  }
};

export const growQueryHandler = {
  getSrkGrowProfile,
  getAllSrkGrowEnrollmentUser,
  getSrkGrowEnrollmentUserById,
  getAllSrkGrowUsers,
  getAllSrkGrowAffiliateUsers,
  getAllSrkGrowAffiliateVerificationRequest,
  getSrkGrowAffiliateEarningPayoutRequestByAdmin,
  getSrkGrowAffiliateEarningPayoutRequestByUser,
  getSrkGrowAffiliateVerificationRequest,
  getTaskMonitoring,
  getGrowAffiliateUser,
  getGlobalOverview,
};