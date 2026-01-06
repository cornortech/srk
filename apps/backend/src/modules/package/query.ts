import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { packageContract } from '@srk/shared/contracts';
import { PackageModel } from '../../model/packageModel';
import { growSocialMediaPackageModel } from '../../model/growSocialMediaPackageModel';
import { growSocialMediaPackageTypeModel } from '../../model/growSocialMediaPackageTypeModel';
import { growSocialMediaPackageSubTypeModel } from '../../model/growSocialMediaPackageSubTypeModel';

const getAllPackages: AppRouteImplementationOrOptions<
  typeof packageContract.getAllPackages
> = async () => {
  try {
    const packages = await PackageModel.find().sort({
      discountedPrice: 1,
    });

    return {
      status: 200,
      body: packages.map((p) => ({
        _id: p._id.toString(),
        price: p.price,
        description: p.description,
        currency: p.currency,
        features: p.features.map((f) => ({
          text: f.text,
          included: f.included,
        })),
        title: p.title,
        image: p.image || '',
        discountedPrice: p.discountedPrice,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
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

const getPackageById: AppRouteImplementationOrOptions<
  typeof packageContract.getPackageById
> = async ({ params }) => {
  try {
    const packageExist = await PackageModel.findById(params.id);

    if (!packageExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Package not found',
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: packageExist._id.toString(),
        price: packageExist.price,
        description: packageExist.description,
        currency: packageExist.currency,
        features: packageExist.features.map((f) => ({
          text: f.text,
          included: f.included,
        })),
        title: packageExist.title,
        image: packageExist.image || '',
        discountedPrice: packageExist.discountedPrice,
        created_at: packageExist.createdAt,
        updated_at: packageExist.updatedAt,
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

// SRK Grow Packages

const getAllSrkGrowPackages: AppRouteImplementationOrOptions<
  typeof packageContract.getAllSrkGrowPackages
> = async () => {
  try {
    // Fetch all grow social media packages
    const packages = await growSocialMediaPackageModel.find();

    // For each package, fetch its types and subtypes
    const packagesWithTypes = await Promise.all(
      packages.map(async (pkg) => {
        const packageTypes = await growSocialMediaPackageTypeModel.find({
          growSocialMediaPackageId: pkg._id,
        });

        // For each type, fetch its subtypes
        const typesWithSubTypes = await Promise.all(
          packageTypes.map(async (type) => {
            const subTypes = await growSocialMediaPackageSubTypeModel.find({
              growSocialMediaPackageTypeId: type._id,
            });

            return {
              _id: type._id.toString(),
              growSocialMediaPackageId:
                type.growSocialMediaPackageId.toString(),
              name: type.name,
              description: type.description,
              amount: type.amount,
              createdAt: type.createdAt,
              updatedAt: type.updatedAt,
              packageSubTypes: subTypes.map((subType) => ({
                _id: subType._id.toString(),
                growSocialMediaPackageTypeId:
                  subType.growSocialMediaPackageTypeId.toString(),
                name: subType.name,
                description: subType.description,
                noOfLikes: subType.noOfLikes,
                noOfVideos: subType.noOfVideos,
                noOfFollowers: subType.noOfFollowers,
                createdAt: subType.createdAt,
                updatedAt: subType.updatedAt,
              })),
            };
          })
        );

        return {
          _id: pkg._id.toString(),
          name: pkg.name,
          description: pkg.description,
          socialMediaPlatforms: pkg.socialMediaPlatforms,
          features: pkg.features,
          amount: pkg.amount,
          amountBeforeDiscount: pkg.amountBeforeDiscount,
          isPopular: pkg.isPopular,
          createdAt: pkg.createdAt,
          updatedAt: pkg.updatedAt,
          packageTypes: typesWithSubTypes,
        };
      })
    );

    return {
      status: 200,
      body: packagesWithTypes,
    };
  } catch (error) {
    console.error('Error fetching SRK Grow packages:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

// SRK Grow Package by Id
const getSrkGrowPackageById: AppRouteImplementationOrOptions<
  typeof packageContract.getSrkGrowPackageById
> = async ({ params }) => {
  try {
    const packageExist = await growSocialMediaPackageModel
      .findById(params.id)
      .lean();

    if (!packageExist) {
      return {
        status: 404,
        body: {
          message: 'Package doesnot exist!',
        },
      };
    }

    const packageTypes = await growSocialMediaPackageTypeModel
      .find({ growSocialMediaPackageId: packageExist._id })
      .lean();

    const packageTypesWithSubTypes = await Promise.all(
      packageTypes.map(async (type) => {
        const subTypes = await growSocialMediaPackageSubTypeModel
          .find({ growSocialMediaPackageTypeId: type._id })
          .lean();

        return {
          _id: type._id.toString(),
          growSocialMediaPackageId: type.growSocialMediaPackageId.toString(),
          name: type.name,
          description: type.description,
          amount: type.amount,
          createdAt: type.createdAt,
          updatedAt: type.updatedAt,
          packageSubTypes: subTypes.map((sub) => ({
            _id: sub._id.toString(),
            growPackageTypeId: sub.growSocialMediaPackageTypeId.toString(),
            name: sub.name,
            description: sub.description,
            noOfLikes: sub.noOfLikes,
            noOfVideos: sub.noOfVideos,
            noOfFollowers: sub.noOfFollowers,
            createdAt: sub.createdAt,
            updatedAt: sub.updatedAt,
          })),
        };
      })
    );

    return {
      status: 200,
      body: {
        _id: packageExist._id.toString(),
        name: packageExist.name,
        description: packageExist.description,
        socialMediaPlatforms: packageExist.socialMediaPlatforms,
        features: packageExist.features,
        amount: packageExist.amount,
        amountBeforeDiscount: packageExist.amountBeforeDiscount,
        isPopular: packageExist.isPopular,
        packageTypes: packageTypesWithSubTypes,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: {
        message: error.message
          ? `Internal server error: ${error.message}`
          : 'Internal server error',
        success: false,
      },
    };
  }
};

export const packageQueryHandler = {
  getAllPackages,
  getPackageById,
  getAllSrkGrowPackages,
  getSrkGrowPackageById,
};
