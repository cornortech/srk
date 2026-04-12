import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { appSettingsContract } from '@srk/shared/contracts';
import { getOrCreateAppSettings } from '../../model/appSettingsModel';
import mongoose from 'mongoose';
import { QRCodeModel } from '../../model/qrCodeModel';

export const getAppSettings: AppRouteImplementationOrOptions<
  typeof appSettingsContract.getAppSettings
> = async () => {
  try {
    const settings = await getOrCreateAppSettings();
    const settingsObj = settings.toObject();
    
    return {
      status: 200,
      body: {
        success: true,
        data: {
          ...settingsObj,
          _id: settingsObj._id.toString(),
          createdAt: settingsObj.createdAt.toISOString(),
          updatedAt: settingsObj.updatedAt.toISOString(),
        },
      },
    };
  } catch (error) {
    console.error('Error fetching app settings:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to fetch app settings',
      },
    };
  }
};

export const getAllQRCodes: AppRouteImplementationOrOptions<
  typeof appSettingsContract.getAllQRCodes
> = async () => {
  try {
    const qrCodes = await QRCodeModel.find().sort({ createdAt: -1 }).lean();

    return {
      status: 200,
      body: {
        success: true,
        data: qrCodes.map(qr => ({
          _id: qr._id?.toString(),
          name: qr.name,
          qr: qr.qr,
          isAvailable: qr.isAvailable,
          type: qr.type,
          createdAt: qr.createdAt,
          updatedAt: qr.updatedAt,
        })),
        message: 'QR codes retrieved successfully',
      },
    };
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to fetch QR codes',
      },
    };
  }
};

export const getAvailableQRCodes: AppRouteImplementationOrOptions<
  typeof appSettingsContract.getAvailableQRCodes
> = async () => {
  try {
    const qrCodes = await QRCodeModel.find()
      .sort({ createdAt: -1 })
      .lean();

    return {
      status: 200,
      body: {
        success: true,
        data: qrCodes.map(qr => ({
          _id: qr._id?.toString(),
          name: qr.name,
          qr: qr.qr,
          type: qr.type,
          isAvailable: qr.isAvailable,
          createdAt: qr.createdAt,
          updatedAt: qr.updatedAt,
        })),
        message: 'Available QR codes retrieved successfully',
      },
    };
  } catch (error) {
    console.error('Error fetching available QR codes:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to fetch available QR codes',
      },
    };
  }
};

export const getQRCodeById: AppRouteImplementationOrOptions<
  typeof appSettingsContract.getQRCodeById
> = async ({ params }) => {
  try {
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Invalid QR code ID',
        },
      };
    }

    const qrCode = await QRCodeModel.findById(id).lean();

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
        data: {
          _id: qrCode._id?.toString(),
          name: qrCode.name,
          qr: qrCode.qr,
          type: qrCode.type,
          isAvailable: qrCode.isAvailable,
          createdAt: qrCode.createdAt,
          updatedAt: qrCode.updatedAt,
        },
        message: 'QR code retrieved successfully',
      },
    };
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Failed to fetch QR code',
      },
    };
  }
};
