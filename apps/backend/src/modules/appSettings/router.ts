import { initServer } from '@ts-rest/express';
import { appSettingsContract } from '@srk/shared/contracts';
import { getAppSettings } from './query';
import { updateAppSettings } from './mutation';

const s = initServer();

export const appSettingsRouter = s.router(appSettingsContract, {
  getAppSettings,
  updateAppSettings,
});
