import { randomUUID } from 'crypto';
import { deleteFileFromR2, uploadFileToR2 } from './r2Service';
import { env } from '../config/env';

export const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/**
 * Parses a data URL string and extracts the image buffer, content type, and extension
 * @param dataUrl - Base64 data URL in format: data:image/jpeg;base64,...
 * @returns Object with buffer, contentType, and extension
 * @throws Error if data URL is invalid or unsupported format
 */
export const parseImageDataUrl = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    throw new Error('Invalid image data URL');
  }

  const contentType = match[1].toLowerCase();
  if (!MIME_EXTENSION_MAP[contentType]) {
    throw new Error(`Unsupported image type: ${contentType}`);
  }

  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length) {
    throw new Error('Image payload is empty');
  }

  return {
    buffer,
    contentType,
    extension: MIME_EXTENSION_MAP[contentType],
  };
};

/**
 * Uploads a base64-encoded image data URL to Cloudflare R2
 * @param dataUrl - Base64 data URL
 * @param folder - R2 folder path (e.g., 'grow/kyc', 'task/documents')
 * @param filePrefix - Prefix for generated filename (e.g., 'grow-kyc', 'task-doc')
 * @returns The R2 asset path key
 */
export const uploadImageDataUrlToR2 = async (
  dataUrl: string,
  folder: string,
  filePrefix: string
) => {
  const rootFolder = env.R2_PREFIX_FOLDER;
  const { buffer, contentType, extension } = parseImageDataUrl(dataUrl);
  const fileName = `${filePrefix}-${Date.now()}-${randomUUID()}.${extension}`;
  // Log the effective target (prefix + folder) so runtime shows srk/dev clearly
  console.log(`[R2] Upload target: ${rootFolder}/${folder}/${fileName}`);
  return uploadFileToR2(buffer, fileName, folder, contentType);
};

/**
 * Cleans up uploaded R2 files on error or rollback
 * Uses Promise.allSettled to ensure all deletions are attempted even if some fail
 * @param keys - Array of R2 asset path keys to delete
 */
export const cleanupR2Uploads = async (keys: string[]) => {
  if (!keys.length) return;

  await Promise.allSettled(keys.map((key) => deleteFileFromR2(key)));
};
