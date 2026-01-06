import { AppRouteImplementation } from '@ts-rest/express';
import { PackageModel } from '../../model/packageModel';
import { packageContract } from '@srk/shared/contracts';
import { growSocialMediaPackageModel } from '../../model/growSocialMediaPackageModel';
import { growSocialMediaPackageTypeModel } from '../../model/growSocialMediaPackageTypeModel';
import { growSocialMediaPackageSubTypeModel } from '../../model/growSocialMediaPackageSubTypeModel';


export const createPackage: AppRouteImplementation<
  typeof packageContract.createPackage
> = async ({ req }) => {
  await PackageModel.create({
    price: req.body.price,
    discountedPrice: req.body.discountedPrice,
    description: req.body.description,
    currency: req.body.currency,
    features: req.body.features,
    title: req.body.title,
    image: req.body.image || '',
  });

  return {
    status: 201,
    body: {
      success: true,
      message: 'Package created successfully',
    },
  };
};
export const deletePackageById: AppRouteImplementation<
  typeof packageContract.deletePackageById
> = async ({ req }) => {
  const { id } = req.params;

  const packageExist = await PackageModel.findById(id);

  if (!packageExist) {
    return {
      status: 404,
      body: {
        success: false,
        message: 'Package not found',
      },
    };
  }

  await PackageModel.findByIdAndDelete(id);

  return {
    status: 200,
    body: {
      success: true,
      message: 'Package deleted successfully',
    },
  };
};

// Create Grow Social Media Package
export const createGrowSocialMediaPackage: AppRouteImplementation<
  typeof packageContract.createGrowSocialMediaPackage
> = async ({ body }) => {
  try {
    const newPackage = await growSocialMediaPackageModel.create(body);

    return {
      status: 201,
      body: {
        success: true,
        message: 'Package created successfully',
        packageId: newPackage._id.toString(),
      },
    };
  } catch (error: unknown) {
    return {
      status: 500,
      body: {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create package',
      },
    };
  }
};

// Create Grow Package Type
export const createGrowPackageType: AppRouteImplementation<
  typeof packageContract.createGrowPackageType
> = async ({ body }) => {
  try {
    const newType = await growSocialMediaPackageTypeModel.create(body);

    return {
      status: 201,
      body: {
        success: true,
        message: 'Package type created successfully',
        typeId: newType._id.toString(),
      },
    };
  } catch (error: unknown) {
    return {
      status: 500,
      body: {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create package type',
      },
    };
  }
};

// Create Grow Package SubType
export const createGrowPackageSubType: AppRouteImplementation<
  typeof packageContract.createGrowPackageSubType
> = async ({ body }) => {
  try {
    const newSubType = await growSocialMediaPackageSubTypeModel.create(body);

    return {
      status: 201,
      body: {
        success: true,
        message: 'Package subtype created successfully',
        subTypeId: newSubType._id.toString(),
      },
    };
  } catch (error: unknown) {
    return {
      status: 500,
      body: {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create package subtype',
      },
    };
  }
};

// Update Grow Social Media Package
export const updateGrowSocialMediaPackage: AppRouteImplementation<
  typeof packageContract.updateGrowSocialMediaPackage
> = async ({ params, body }) => {
  try {
    const { id } = params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = body;

    const updatedPackage = await growSocialMediaPackageModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedPackage) {
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
        success: true,
        message: 'Package updated successfully',
      },
    };
  } catch (error: unknown) {
    return {
      status: 500,
      body: {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update package',
      },
    };
  }
};

// Update Grow Package Type
export const updateGrowPackageType: AppRouteImplementation<
  typeof packageContract.updateGrowPackageType
> = async ({ params, body }) => {
  try {
    const { id } = params;
    const { _id: _unusedId, ...updateData } = body;

    const updatedType = await growSocialMediaPackageTypeModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedType) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Package type not found',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Package type updated successfully',
      },
    };
  } catch (error: unknown) {
    return {
      status: 500,
      body: {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update package type',
      },
    };
  }
};

// Update Grow Package SubType
export const updateGrowPackageSubType: AppRouteImplementation<
  typeof packageContract.updateGrowPackageSubType
> = async ({ params, body }) => {
  try {
    const { id } = params;
    const { _id: _unusedId, ...updateData } = body;

    const updatedSubType = await growSocialMediaPackageSubTypeModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedSubType) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Package subtype not found',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Package subtype updated successfully',
      },
    };
  } catch (error: unknown) {
    return {
      status: 500,
      body: {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update package subtype',
      },
    };
  }
};

// Delete Grow Social Media Package
export const deleteGrowSocialMediaPackage: AppRouteImplementation<
  typeof packageContract.deleteGrowSocialMediaPackage
> = async ({ params }) => {
  try {
    const { id } = params;

    const deletedPackage = await growSocialMediaPackageModel.findByIdAndDelete(id);

    if (!deletedPackage) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Package not found',
        },
      };
    }

    // Also delete associated types and subtypes
    await growSocialMediaPackageTypeModel.deleteMany({ growSocialMediaPackageId: id });
    await growSocialMediaPackageSubTypeModel.deleteMany({ growSocialMediaPackageId: id });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Package and associated types deleted successfully',
      },
    };
  } catch (error: unknown) {
    return {
      status: 500,
      body: {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete package',
      },
    };
  }
};

// Delete Grow Package Type
export const deleteGrowPackageType: AppRouteImplementation<
  typeof packageContract.deleteGrowPackageType
> = async ({ params }) => {
  try {
    const { id } = params;

    const deletedType = await growSocialMediaPackageTypeModel.findByIdAndDelete(id);

    if (!deletedType) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Package type not found',
        },
      };
    }

    // Also delete associated subtypes
    await growSocialMediaPackageSubTypeModel.deleteMany({ growSocialMediaPackageTypeId: id });

    return {
      status: 200,
      body: {
        success: true,
        message: 'Package type and associated subtypes deleted successfully',
      },
    };
  } catch (error: unknown) {
    return {
      status: 500,
      body: {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete package type',
      },
    };
  }
};

// Delete Grow Package SubType
export const deleteGrowPackageSubType: AppRouteImplementation<
  typeof packageContract.deleteGrowPackageSubType
> = async ({ params }) => {
  try {
    const { id } = params;

    const deletedSubType = await growSocialMediaPackageSubTypeModel.findByIdAndDelete(id);

    if (!deletedSubType) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Package subtype not found',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Package subtype deleted successfully',
      },
    };
  } catch (error: unknown) {
    return {
      status: 500,
      body: {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete package subtype',
      },
    };
  }
};

export const packageMutationHandler = {
  createPackage,
  deletePackageById,
  createGrowSocialMediaPackage,
  createGrowPackageType,
  createGrowPackageSubType,
  updateGrowSocialMediaPackage,
  updateGrowPackageType,
  updateGrowPackageSubType,
  deleteGrowSocialMediaPackage,
  deleteGrowPackageType,
  deleteGrowPackageSubType,
};