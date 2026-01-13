import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { appSettingsContract } from '@srk/shared/contracts';
import { AppSettingsModel } from '../../model/appSettingsModel';

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
        qrcodeUrl: '',
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
