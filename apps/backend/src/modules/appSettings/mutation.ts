import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { appSettingsContract, PaymentQRType } from '@srk/shared/contracts';
import { AppSettingsModel } from '../../model/appSettingsModel';
import mongoose from 'mongoose';
import { QRCodeModel } from '../../model/qrCodeModel';

export const updateAppSettings: AppRouteImplementationOrOptions<
  typeof appSettingsContract.updateAppSettings
> = async ({ body }) => {
  try {
    const updates = body;
    
    // Validate that at least one field is being updated
    if (Object.keys(updates).length === 0) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'No fields to update',
        },
      };
    }
    
    // Get existing settings or create if not exists
    let settings = await AppSettingsModel.findOne();
    
    if (!settings) {
      settings = await AppSettingsModel.create({
        taskFeatureEnabled: true,
        maintenanceMode: false,
        announcementMessage: '',
        ...updates,
      });
    } else {
      // Update existing settings
      Object.assign(settings, updates);
      await settings.save();
    }
    
    const settingsObj = settings.toObject();
    
    return {
      status: 200,
      body: {
        success: true,
        message: 'App settings updated successfully',
        data: {
          ...settingsObj,
          _id: settingsObj._id.toString(),
          createdAt: settingsObj.createdAt.toISOString(),
          updatedAt: settingsObj.updatedAt.toISOString(),
        },
      },
    };
  } catch (error) {
    console.error('Error updating app settings:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to update app settings',
      },
    };
  }
};

export const createQRCode: AppRouteImplementationOrOptions<
  typeof appSettingsContract.createQRCode
> = async ({ body }) => {
  try {
    const { name, qr, type } = body;

    // Validate required fields
    if (!name || !qr || !type) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Name, QR code image, and type are required',
        },
      };
    }

    // Check if QR code with same name already exists
    const existingQRCode = await QRCodeModel.findOne({ name });
    if (existingQRCode) {
      return {
        status: 409,
        body: {
          success: false,
          message: 'QR code with this name already exists',
        },
      };
    }

    // Create new QR code
    const newQRCode = new QRCodeModel({
      name,
      qr,
      type: type as PaymentQRType,
      isAvailable: true,
    });

    const savedQRCode = await newQRCode.save();

    return {
      status: 201,
      body: {
        success: true,
        data: {
          _id: savedQRCode._id.toString(),
          name: savedQRCode.name,
          qr: savedQRCode.qr,
          type: savedQRCode.type,
          isAvailable: savedQRCode.isAvailable,
          createdAt: savedQRCode.createdAt,
          updatedAt: savedQRCode.updatedAt,
        },
        message: 'QR code created successfully',
      },
    };
  } catch (error) {
    console.error('Error creating QR code:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to create QR code',
      },
    };
  }
};

export const updateQRCode: AppRouteImplementationOrOptions<
  typeof appSettingsContract.updateQRCode
> = async ({ params, body }) => {
  try {
    const { id } = params;
    const { name, qr, isAvailable, type } = body;

    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Invalid QR code ID',
        },
      };
    }

    // Check if QR code exists
    const qrCode = await QRCodeModel.findById(id);
    if (!qrCode) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'QR code not found',
        },
      };
    }

    // If name is being updated, check for duplicates
    if (name && name !== qrCode.name) {
      const existingQRCode = await QRCodeModel.findOne({ name });
      if (existingQRCode) {
        return {
          status: 409,
          body: {
            success: false,
            message: 'QR code with this name already exists',
          },
        };
      }
    }

    // Update fields
    if (name) qrCode.name = name;
    if (qr) qrCode.qr = qr;
    if (type) qrCode.type = type as PaymentQRType;
    if (isAvailable !== undefined) qrCode.isAvailable = isAvailable;

    const updatedQRCode = await qrCode.save();

    return {
      status: 200,
      body: {
        success: true,
        data: {
          _id: updatedQRCode._id.toString(),
          name: updatedQRCode.name,
          qr: updatedQRCode.qr,
          type: updatedQRCode.type,
          isAvailable: updatedQRCode.isAvailable,
          createdAt: updatedQRCode.createdAt,
          updatedAt: updatedQRCode.updatedAt,
        },
        message: 'QR code updated successfully',
      },
    };
  } catch (error) {
    console.error('Error updating QR code:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to update QR code',
      },
    };
  }
};

export const deleteQRCode: AppRouteImplementationOrOptions<
  typeof appSettingsContract.deleteQRCode
> = async ({ params }) => {
  try {
    const { id } = params;

    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Invalid QR code ID',
        },
      };
    }

    // Find and delete QR code
    const qrCode = await QRCodeModel.findByIdAndDelete(id);

    if (!qrCode) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'QR code not found',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'QR code deleted successfully',
      },
    };
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to delete QR code',
      },
    };
  }
};
