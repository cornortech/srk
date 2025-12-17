import { growContract } from '@srk/shared/contracts';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { growSocialMediaPackageEnrollmentModel } from '../../model/growSocialMediaPackageEnrollement';
import { GrowEnrollmentPopulated } from '../../utils/types/growQuery';

const getAllSrkGrowEnrollementUser: AppRouteImplementationOrOptions<
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

    return {
      status: 200,
      body: {
        data: enrollments.map((e) => ({
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
          enrollementData: {
            growSocialMediaPackageId: e.growSocialMediaPackageId._id.toString(),
            growSocialMediaPackageTypeId:
              e.growSocialMediaPackageTypeId._id.toString(),
            growSocialMediaPackageSubTypeId:
              e.growSocialMediaPackageSubTypeId._id.toString(),
            profileLinkURL: e.profileLinkURL,
            isActive: e.isActive,
          },
          paymentData: {
            paymentMethod: 'esewa',
            paymentURL: '',
            transactionId: '',
            rejectionReason: '',
          },
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
        })),
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


const getSrkGrowEnrollementUserById: AppRouteImplementationOrOptions<
  typeof growContract.getGrowSocialMediaEnrollementById
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

// SRK Grow Enrollment Users

export const growEnrollmentUserQueryHandler = {
  getSrkGrowEnrollementUserById,
  getAllSrkGrowEnrollementUser,
};
