import {
  growContract,
} from '@srk/shared/contracts';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { growSocialMediaPackageEnrollmentModel } from '../../model/growSocialMediaPackageEnrollment';
import {
  GrowEnrollmentPopulated,
  GrowPackageUserPopulated,
  GrowProfileResponsePopulated,
} from '../../utils/types/growQuery';
import { growPackageTodoModel } from '../../model/growPackageTodoModel';
import { growSocialMediaPackagePaymentModel } from '../../model/growSocialMediaPackagePaymentModel';
import { growSocialMediaPackageUserModel } from '../../model/growSocialMediaPackageUserModel';
import { growSrkAffiliateVerificationModel } from '../../model/growSrkAffiliateVerificationModel';
import { IUser } from '../../model/userModel';
import { GrowSrkAffiliateEarningPayoutModel } from '../../model/grow/growSrkAffiliateEarningPayoutModel';
import { growSrkAffiliateEarningStatementModel } from '../../model/grow/growSrkAffiliateEarningStatementModel';

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

    const activeReferrals = await growSocialMediaPackageUserModel.countDocuments(
      {
        referredBy: packageUser._id,
        status: 'portalActivated',
      }
    );

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
          userType: packageUser.userType,

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
            packageSubTypeName: e.growSocialMediaPackageSubTypeId?.name ?? 'Unknown',
            socialMediaPlatform: e.socialMediaPlatform ?? 'Unknown',
            noOfFollowers: e.growSocialMediaPackageSubTypeId?.noOfFollowers ?? 0,
            noOfLikes: e.growSocialMediaPackageSubTypeId?.noOfLikes ?? 0,
            noOfVideos: e.noOfVideos ?? 0,
          },

          postEngagement: {
            postURLs: postEngagement?.map((post) => post.postUrl) ?? [],
          },

          paymentData: {
            paymentMethod: 'esewa' as const,
            paymentURL: '',
            transactionId: '',
            rejectionReason: '',
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
            title: enrollment.growSocialMediaPackageId.title ?? enrollment.growSocialMediaPackageId.name ?? 'Unknown',
            price: enrollment.growSocialMediaPackageId.price ?? enrollment.growSocialMediaPackageId.amount ?? 0,
          },
          packageType: {
            _id: enrollment.growSocialMediaPackageTypeId._id,
            title: enrollment.growSocialMediaPackageTypeId.title ?? enrollment.growSocialMediaPackageTypeId.name ?? 'Unknown',
          },
          packageSubType: {
            _id: enrollment.growSocialMediaPackageSubTypeId._id,
            title: enrollment.growSocialMediaPackageSubTypeId.title ?? enrollment.growSocialMediaPackageSubTypeId.name ?? 'Unknown',
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
    const { userType, search } = query || {};

    // Build enrollment filter based on userType and search
    let enrollmentFilter: any = {};
    const userFilter: any = {};

    if (userType) {
      userFilter.userType = userType;
    }

    if (search) {
      userFilter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (userType || search) {
      // First, get users matching the filter
      const users = await growSocialMediaPackageUserModel
        .find(userFilter)
        .select('_id')
        .lean();

      const userIds = users.map((u) => u._id);

      // If no users found, return empty array
      if (userIds.length === 0) {
        return {
          status: 200,
          body: [],
        };
      }

      enrollmentFilter = {
        growSocialMediaPackageUserId: { $in: userIds },
      };
    }

    const usersLists = await growSocialMediaPackageEnrollmentModel
      .find(enrollmentFilter)
      .populate<GrowPackageUserPopulated>({
        path: 'growSocialMediaPackageUserId',
        select: 'fullName referredBy status',
        populate: {
          path: 'referredBy',
          select: 'fullName',
        },
      })
      .populate<GrowPackageUserPopulated>({
        path: 'growSocialMediaPackageId',
        select: 'name',
      })
      .sort({ createdAt: -1 })
      .lean();

    return {
      status: 200,
      body: usersLists.map((u) => ({
        _id: u.growSocialMediaPackageUserId._id.toString(),
        fullName: u.growSocialMediaPackageUserId.fullName,
        referredBy: u.growSocialMediaPackageUserId.referredBy?.fullName ?? null,
        status: u.growSocialMediaPackageUserId.status,
        socialMediaPackage: {
          _id: u.growSocialMediaPackageId._id.toString(),
          name: u.growSocialMediaPackageId.name,
        },
      })),
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
    const growUser = await growSocialMediaPackageUserModel.findById(userId);

    if (!growUser) {
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

const getApprovedSrkGrowAffiliateVerificationRequest: AppRouteImplementationOrOptions<
  typeof growContract.getApprovedSrkGrowAffiliateVerificationRequest
> = async ({ query }) => {
  try {
    const srkUniversityUserId = query.srkUniversityUserId;

    
    const verificationRecord = await growSrkAffiliateVerificationModel.findOne({
      srkUniversityUserId,
    });

    if (!verificationRecord) {
      return {
        status: 403,
        body: {
          success: false,
          message: 'Affiliate Verification not found',
          verificationRequests: [],
          relatedUserData: [],
        },
      };
    }

    if (verificationRecord.status !== 'approved') {
      return {
        status: 203,
        body: {
          success: false,
          message: `Verification status: ${verificationRecord.status}`,
          verificationRequests: [verificationRecord],
          relatedUserData: [],
        },
      };
    }

    // ✅ Only required fields returned
    const userData = await growSocialMediaPackageUserModel.findOne(
      { srkUniversityUserId },
      { _id: 1, status: 1, userType: 1 }
    );

    return {
      status: 200,
      body: {
        success: true,
        message: 'Affiliate approved',
        verificationRequests: [verificationRecord],
        relatedUserData: userData ? [userData] : [],
      },
    };
  } catch (error: any) {
    console.log('Error in affiliate verification check:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message ?? 'Internal server error',
        verificationRequests: [],
        relatedUserData: [],
      },
    };
  }
};

const getTaskMonitoring: AppRouteImplementationOrOptions<
  typeof growContract.getTaskMonitoring
> = async ({ query }) => {
  try {
    const { search } = query || {};

    // Build user filter based on search
    const userFilter: any = { userType: 'package' };

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
      .populate('growSocialMediaPackageSubTypeId', 'name noOfLikes noOfFollowers')
      .lean();

    // Build result array
    const taskMonitoringData = await Promise.all(
      enrollments.map(async (enrollment: any) => {
        const user = users.find(
          (u) => u._id.toString() === enrollment.growSocialMediaPackageUserId.toString()
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

        const requiredFollows = enrollment.growSocialMediaPackageSubTypeId?.noOfFollowers || 0;
        const requiredLikes = enrollment.growSocialMediaPackageSubTypeId?.noOfLikes || 0;

        const completedFollows = followTasks.reduce((sum, task) => sum + task.followCounts, 0);
        const completedLikes = likeTasks.reduce((sum, task) => sum + task.likeCounts, 0);

        const followPercentage = requiredFollows > 0 
          ? Math.min(100, Math.round((completedFollows / requiredFollows) * 100))
          : 0;

        const likePercentage = requiredLikes > 0
          ? Math.min(100, Math.round((completedLikes / requiredLikes) * 100))
          : 0;

        // Get individual video details for like tasks
        const noOfVideos = enrollment.noOfVideos || likeTasks.length;
        const likesPerVideo = noOfVideos > 0 ? Math.ceil(requiredLikes / noOfVideos) : requiredLikes;
        
        const videos = likeTasks.map((task) => ({
          postUrl: task.postUrl || '',
          profileUrl: task.profileUrl || '',
          likeCounts: task.likeCounts || 0,
          totalRequired: likesPerVideo,
          percentage: likesPerVideo > 0 
            ? Math.min(100, Math.round((task.likeCounts / likesPerVideo) * 100))
            : 0,
        }));

        // Get profile details for follow tasks
        const followsPerProfile = followTasks.length > 0 ? Math.ceil(requiredFollows / followTasks.length) : requiredFollows;
        const profiles = followTasks.map((task) => ({
          profileUrl: task.profileUrl || '',
          followCounts: task.followCounts || 0,
          totalRequired: followsPerProfile,
          percentage: followsPerProfile > 0
            ? Math.min(100, Math.round((task.followCounts / followsPerProfile) * 100))
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

        overallPercentage = taskCount > 0 ? Math.round(overallPercentage / taskCount) : 0;

        return {
          _id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          status: user.status,
          enrollmentId: enrollment._id.toString(),
          platform: enrollment.socialMediaPlatform,
          packageName: enrollment.growSocialMediaPackageId?.name || 'Unknown',
          packageSubTypeName: enrollment.growSocialMediaPackageSubTypeId?.name || 'Unknown',
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
          createdAt: enrollment.createdAt?.toISOString() || new Date().toISOString(),
        };
      })
    );

    // Filter out nulls and sort by completion percentage
    const filteredData = taskMonitoringData
      .filter((data) => data !== null)
      .sort((a, b) => b.overallCompletionPercentage - a.overallCompletionPercentage);

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
    const revenueMatch: Record<string, unknown> = startDate ? { createdAt: { $gte: startDate } } : {};
    const revenueResult = await growSocialMediaPackageEnrollmentModel.aggregate([
      { $match: revenueMatch },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
        },
      },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Calculate total liability from affiliate earning statements (filtered by date if applicable)
    const liabilityMatch: Record<string, unknown> = startDate ? { createdAt: { $gte: startDate } } : {};
    const liabilityResult = await growSrkAffiliateEarningStatementModel.aggregate([
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
    const affiliateCount = await growSocialMediaPackageUserModel.countDocuments({
      userType: 'affiliate',
      status: 'portalActivated',
    });

    // Get monthly trends based on time range
    const monthsToShow = timeRange === '1year' ? 12 : timeRange === '6months' ? 6 : 24; // 24 for 'all' (last 2 years)
    const trendsStartDate = new Date();
    trendsStartDate.setMonth(trendsStartDate.getMonth() - monthsToShow);

    // Revenue trends
    const revenueTrends = await growSocialMediaPackageEnrollmentModel.aggregate([
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
    ]);

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
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendsArray: Array<{ month: string; revenue: number; users: number; sortKey: string }> = [];

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
    const trends = trendsArray.map(({ month, revenue, users }) => ({
      month,
      revenue,
      users,
    })).reverse();

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

export const growQueryHandler = {
  getSrkGrowProfile,
  getAllSrkGrowEnrollmentUser,
  getSrkGrowEnrollmentUserById,
  getAllSrkGrowUsers,
  getAllSrkGrowAffiliateVerificationRequest,
  getSrkGrowAffiliateEarningPayoutRequestByAdmin,
  getSrkGrowAffiliateEarningPayoutRequestByUser,
  getApprovedSrkGrowAffiliateVerificationRequest,
  getTaskMonitoring,
  getGlobalOverview,
};
