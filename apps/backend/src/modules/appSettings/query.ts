import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { appSettingsContract } from '@srk/shared/contracts';
import { getOrCreateAppSettings } from '../../model/appSettingsModel';

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
