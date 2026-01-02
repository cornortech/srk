import {
  getAllAffiliateRequestsByStatusSchema,
  getAllSrkGrowAffiliateVerificationRequestSchema,
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

    const engagementPosts = packageEnrollment
      ? await growPackageTodoModel
          .find({
            growSocialMediaPackageEnrollmentId: packageEnrollment._id,
            type: 'like',
          })
          .lean()
      : null;

    const profileLinkURLs = packageEnrollment
      ? await growPackageTodoModel.find({
          growSocialMediaPackageEnrollmentId: packageEnrollment._id,
          type: 'follow',
        })
      : null;

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
            profileLinkURLs?.map((profile) => profile.profileUrl) ?? [],
          userType: packageUser.userType,

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

              engagementPostURLs:
                engagementPosts?.map((post) => post.postUrl) ?? [],

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
            isActive: e.isActive,
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
            title: enrollment.growSocialMediaPackageId.title,
            price: enrollment.growSocialMediaPackageId.price,
          },
          packageType: {
            _id: enrollment.growSocialMediaPackageTypeId._id,
            title: enrollment.growSocialMediaPackageTypeId.title,
          },
          packageSubType: {
            _id: enrollment.growSocialMediaPackageSubTypeId._id,
            title: enrollment.growSocialMediaPackageSubTypeId.title,
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
> = async () => {
  try {
    const usersLists = await growSocialMediaPackageEnrollmentModel
      .find({})
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

const getApprovedSrkGrowAffiliateVerificationRequest: AppRouteImplementationOrOptions<
  typeof growContract.getApprovedSrkGrowAffiliateVerificationRequest
> = async ({ query }) => {
  try {
    const srkUniversityUserId = query.srkUniversityUserId;

    const verificationRecord =
      await growSrkAffiliateVerificationModel.findOne({
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


// SRK Grow Enrollment Users
export const growQueryHandler = {
  getSrkGrowProfile,
  getAllSrkGrowEnrollmentUser,
  getSrkGrowEnrollmentUserById,
  getAllSrkGrowUsers,
  getAllSrkGrowAffiliateVerificationRequest,
  getApprovedSrkGrowAffiliateVerificationRequest,
};
