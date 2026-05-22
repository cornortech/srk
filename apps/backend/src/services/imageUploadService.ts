import { randomUUID } from 'crypto';
import { deleteFileFromR2, uploadFileToR2 } from './r2Service';
import { env } from '../config/env';

export const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

/**
 * Parses a data URL string and extracts the image buffer, content type, and extension
 * @param dataUrl - Base64 data URL in format: data:image/jpeg;base64,...
 * @returns Object with buffer, contentType, and extension
 * @throws Error if data URL is invalid or unsupported format
 */
export const parseImageDataUrl = (dataUrl: string) => {
  // Trim whitespace and validate input
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw new Error('Invalid image data URL: empty or not a string');
  }

  const trimmedUrl = dataUrl.trim();
  
  // Try standard data URL format: data:image/type;base64,xxxxx
  // Using [\s\S] instead of . with dotall flag for ES compatibility
  let match = trimmedUrl.match(/^data:(image\/[a-zA-Z0-9.\-+]+);base64,([\s\S]+)$/i);

  if (!match) {
    // Try alternative format without base64 encoding (rare cases)
    match = trimmedUrl.match(/^data:(image\/[a-zA-Z0-9.\-+]+),([\s\S]+)$/i);
    if (match) {
      // For non-base64 data URLs, convert to base64
      const contentType = match[1].toLowerCase();
      if (!MIME_EXTENSION_MAP[contentType]) {
        throw new Error(`Unsupported image type: ${contentType}. Supported formats: ${Object.keys(MIME_EXTENSION_MAP).join(', ')}`);
      }
      // This is likely CSV or other encoding, which we'll skip
      throw new Error('Image data must be base64 encoded. Format: data:image/<type>;base64,<base64data>');
    }
    throw new Error('Invalid image data URL: must be in format "data:image/<type>;base64,<base64data>"');
  }

  const contentType = match[1].toLowerCase();
  if (!MIME_EXTENSION_MAP[contentType]) {
    throw new Error(`Unsupported image type: ${contentType}. Supported formats: ${Object.keys(MIME_EXTENSION_MAP).join(', ')}`);
  }

  // Remove whitespace/newlines from base64 data (common in large images)
  const base64Data = match[2].replace(/\s/g, '');
  
  if (!base64Data.length) {
    throw new Error('Image payload is empty');
  }

  const buffer = Buffer.from(base64Data, 'base64');
  if (!buffer.length) {
    throw new Error('Image payload is empty or invalid base64');
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
