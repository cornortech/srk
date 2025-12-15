import { AppRouteImplementation } from "@ts-rest/express";
import { packageContract } from "@srk/shared/contracts";
import { PackageModel } from "../../model/packageModel";

export const createPackage: AppRouteImplementation<
  typeof packageContract.createPackage
> = async ({ req, res }) => {
  await PackageModel.create({
    price: req.body.price,
    discountedPrice: req.body.discountedPrice,
    description: req.body.description,
    currency: req.body.currency,
    features: req.body.features,
    title: req.body.title,
    image: req.body.image || "",
  });

  return {
    status: 201,
    body: {
      success: true,
      message: "Package created successfully",
    },
  };
};
export const deletePackageById: AppRouteImplementation<
  typeof packageContract.deletePackageById
> = async ({ req, res }) => {
  const { id } = req.params;

  const packageExist = await PackageModel.findById(id);

  if (!packageExist) {
    return {
      status: 404,
      body: {
        success: false,
        message: "Package not found",
      },
    };
  }

  await PackageModel.findByIdAndDelete(id);

  return {
    status: 200,
    body: {
      success: true,
      message: "Package deleted successfully",
    },
  };
};
export const packageMutationHandler = {
  createPackage,
  deletePackageById,
};
