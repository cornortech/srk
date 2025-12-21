import { growContract } from "@srk/shared/contracts";
import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { growSocialMediaPackageEnrollmentModel } from "../../model/growSocialMediaPackageEnrollment";
import { GrowEnrollmentPopulated, GrowPackageUserPopulated, GrowProfileResponsePopulated } from "../../utils/types/growQuery";
import { growPackageEngagementPostModel } from "../../model/growPackageEngagementPostModel";
import { growSocialMediaPackagePaymentModel } from "../../model/growSocialMediaPackagePaymentModel";
import { growSocialMediaPackageUserModel } from "../../model/growSocialMediaPackageUserModel";

export const getSrkGrowProfile: AppRouteImplementationOrOptions<
  typeof growContract.getSrkGrowProfile
> = async ({ params }) => {
  try {

    const {
      userId
    } = params;

    const packageUser = await growSocialMediaPackageUserModel
      .findById(userId)
      .populate<GrowProfileResponsePopulated["growSocialMediaPackageUser"]>({
        path: "referredBy",
        select: "fullName",
      });

    if (!packageUser) {
      return {
        status: 404,
        body: {
          message: "User not found"
        },
      };
    }

    const packageEnrollment = await growSocialMediaPackageEnrollmentModel
      .findOne({
        growSocialMediaPackageUserId: packageUser._id,
      })
      .populate<GrowProfileResponsePopulated["growSocialMediaPackageEnrollment"]>([
        {
          path: "growSocialMediaPackageId",
          select: "name amount",
        },
        {
          path: "growSocialMediaPackageTypeId",
          select: "name",
        },
        {
          path: "growSocialMediaPackageSubTypeId",
          select: "name noOfLikes noOfVideos noOfFollowers",
        },
      ]);

    const packagePayment = packageEnrollment ? await growSocialMediaPackagePaymentModel.findOne({
      growPackageEnrollmentId: packageEnrollment._id,
    })
      : null;

    const engagementPosts = packageEnrollment
      ? await growPackageEngagementPostModel.findOne({
        growSocialMediaPackageEnrollmentId: packageEnrollment._id,
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
            packageEnrollment?.profileLinkURL && packageEnrollment.profileLinkURL.length
              ? packageEnrollment.profileLinkURL
              : [],
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
            enrollmentPackageDetails: {
              name: packageEnrollment.growSocialMediaPackageId.name,
              amount: packageEnrollment.growSocialMediaPackageId.amount,
              socialMediaPlatform: packageEnrollment.socialMediaPlatform,
              packageType: {
                name: packageEnrollment.growSocialMediaPackageTypeId.name,

                packageSubType: {
                  name: packageEnrollment.growSocialMediaPackageSubTypeId.name,
                  noOfLikes: packageEnrollment.growSocialMediaPackageSubTypeId.noOfLikes,
                  noOfVideos: packageEnrollment.growSocialMediaPackageSubTypeId.noOfVideos,
                  noOfFollowers: packageEnrollment.growSocialMediaPackageSubTypeId.noOfFollowers,
                },
              },
            },

            engagementPostURLs: engagementPosts?.postURLs ?? [],

            enrollmentPaymentDetails: packagePayment
              ? {
                paymentUrl: packagePayment.paymentURL,
                transactionId: packagePayment.transactionId,
                paymentMethod: packagePayment.paymentMethod,
                rejectionReason:
                  packagePayment.rejectionReason ?? null,
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
        message: "Internal server error",
      },
    };
  }
};

const getAllSrkGrowEnrollmentUser: AppRouteImplementationOrOptions<
  typeof growContract.getAllGrowSocialMediaEnrollment
> = async () => {
  try {
    const enrollments =
      await growSocialMediaPackageEnrollmentModel
        .find()
        .populate<GrowEnrollmentPopulated>("growSocialMediaPackageUserId")
        .populate<GrowEnrollmentPopulated>("growSocialMediaPackageId")
        .populate<GrowEnrollmentPopulated>("growSocialMediaPackageTypeId")
        .populate<GrowEnrollmentPopulated>("growSocialMediaPackageSubTypeId")
        .sort({ createdAt: -1 });

    const packageEnrollment = await Promise.all(
      enrollments.map(async (e) => {
        const postEngagement = await growPackageEngagementPostModel.findOne({
          growSocialMediaPackageEnrollmentId: e._id,
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
            growSocialMediaPackageId:
              e.growSocialMediaPackageId._id.toString(),
            growSocialMediaPackageTypeId:
              e.growSocialMediaPackageTypeId._id.toString(),
            growSocialMediaPackageSubTypeId:
              e.growSocialMediaPackageSubTypeId._id.toString(),
            profileLinkURL: e.profileLinkURL && e.profileLinkURL[0] ? e.profileLinkURL[0] : undefined,
            isActive: e.isActive,
          },

          postEngagement: {
            postURLs: postEngagement?.postURLs.length ? postEngagement.postURLs : undefined,
          },

          paymentData: {
            paymentMethod: "esewa" as const,
            paymentURL: "",
            transactionId: "",
            rejectionReason: "",
          },
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
        };
      })
    );

    return {
      status: 200,
      body: packageEnrollment
    }

  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: "Internal server error",
      },
    };
  }
};

const getSrkGrowEnrollmentUserById: AppRouteImplementationOrOptions<
  typeof growContract.getGrowSocialMediaEnrollmentById
> = async ({ params }) => {
  try {
    const enrollment =
      await growSocialMediaPackageEnrollmentModel
        .findById(params.enrollmentID)
        .populate<GrowEnrollmentPopulated>("growSocialMediaPackageUserId")
        .populate<GrowEnrollmentPopulated>("growSocialMediaPackageId")
        .populate<GrowEnrollmentPopulated>("growSocialMediaPackageTypeId")
        .populate<GrowEnrollmentPopulated>("growSocialMediaPackageSubTypeId");

    if (!enrollment) {
      return {
        status: 404,
        body: {
          success: false,
          message: "Enrollment not found",
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

        enrollmentData: {
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
          profileLinkURL: enrollment.profileLinkURL && enrollment.profileLinkURL[0],
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
        message: error.message
          ? `Internal sever error: ${error.message}`
          : 'Internal server error',
      },
    };
  }
};

const getAllSrkGrowUsers: AppRouteImplementationOrOptions<
  typeof growContract.getAllSrkGrowUsers
> = async () => {
  try {

    const usersLists = await growSocialMediaPackageEnrollmentModel.
      find({})
      .populate<GrowPackageUserPopulated>({
        path: "growSocialMediaPackageUserId",
        select: "fullName referredBy status",
        populate: {
          path: "referredBy",
          select: "fullName",
        },
      })
      .populate<GrowPackageUserPopulated>({
        path: "growSocialMediaPackageId",
        select: "name",
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
    }

  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
      },

    }
  };
};

// SRK Grow Enrollment Users

export const growQueryHandler = {
  getSrkGrowProfile,
  getAllSrkGrowEnrollmentUser,
  getSrkGrowEnrollmentUserById,
  getAllSrkGrowUsers
};
