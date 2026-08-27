import { Request, Response, NextFunction } from 'express';
import { uploadImageDataUrlToR2, cleanupR2Uploads } from '../services/imageUploadService';

const isDataUrl = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith('data:');

export interface FieldMapping {
  folder: string;
  prefix: string;
}

/**
 * Factory function to create a dynamic data URL upload middleware
 * @param fieldMappings - Map of field names to R2 folder and prefix configuration
 * @returns Express middleware function
 */
export const createDataUrlUploadMiddleware = (
  fieldMappings: Record<string, FieldMapping>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const uploadedR2Keys: string[] = [];

    try {
      // Store uploaded keys on req for potential cleanup in error handlers
      (req as any).uploadedR2Keys = uploadedR2Keys;

      if (!req.body || typeof req.body !== 'object') {
        return next();
      }

      // Process each body key
      for (const [key, value] of Object.entries(req.body)) {
        if (isDataUrl(value)) {
          const mapping = fieldMappings[key];
          if (mapping) {
            try {
              const r2Key = await uploadImageDataUrlToR2(
                value,
                mapping.folder,
                mapping.prefix
              );
              req.body[key] = r2Key;
              uploadedR2Keys.push(r2Key);
            } catch (error) {
              console.error(`Failed to upload ${key} to R2:`, error);
              // Cleanup any already-uploaded files on error
              if (uploadedR2Keys.length) {
                await cleanupR2Uploads(uploadedR2Keys);
              }
              throw error;
            }
          }
        }
      }

      next();
    } catch (error) {
      console.error('dataUrlUploadMiddleware error:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to process image uploads',
      });
    }
  };
};

/**
 * Cleanup middleware to remove R2 uploads if an error occurs downstream
 * Attach to error handlers or use in a finally block
 */
export const cleanupDataUrlUploads = async (req: Request) => {
  const uploadedKeys = (req as any).uploadedR2Keys;
  if (uploadedKeys && Array.isArray(uploadedKeys) && uploadedKeys.length) {
    await cleanupR2Uploads(uploadedKeys);
  }
};
