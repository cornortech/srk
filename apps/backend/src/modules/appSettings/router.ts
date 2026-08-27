import { initServer } from '@ts-rest/express';
import { appSettingsContract } from '@srk/shared/contracts';
import { getAppSettings, getAllQRCodes, getAvailableQRCodes, getQRCodeById } from './query';
import { updateAppSettings, createQRCode, updateQRCode, deleteQRCode } from './mutation';

const s = initServer();

export const appSettingsRouter = s.router(appSettingsContract, {
  getAppSettings,
  updateAppSettings,
  getAllQRCodes,
  getAvailableQRCodes,
  getQRCodeById,
  createQRCode,
  updateQRCode,
  deleteQRCode,
});
