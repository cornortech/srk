import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { packageContract } from "../../contract/package/contract";
import { PackageModel } from "../../model/packageModel";

const getAllPackages: AppRouteImplementationOrOptions<
  typeof packageContract.getAllPackages
> = async ({ req, res }) => {
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
        image: p.image || "",
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
        message: "Internal server error",
      },
    };
  }
};

const getPackageById: AppRouteImplementationOrOptions<
  typeof packageContract.getPackageById
> = async ({ req, res, params }) => {
  try {
    const packageExist = await PackageModel.findById(params.id);

    if (!packageExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: "Package not found",
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
        image: packageExist.image || "",
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
        message: "Internal server error",
      },
    };
  }
};

export const packageQueryHandler = {
  getAllPackages,
  getPackageById,
};
