import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

// Cloudflare R2 S3 config
const R2_ACCESS_KEY_ID = 'daf464fc116a11847575b6fbfbac26a0';
const R2_SECRET_ACCESS_KEY = '6414fef2c8ca3715856b08ab2302d1d92e80b7cec32971acc0d85cef559fd4e4';
const R2_ENDPOINT = 'https://5f09c9e5753d5a473d39fed1135fef46.r2.cloudflarestorage.com';
const R2_BUCKET = 'srk';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

export interface UploadProgress {
  [uploadId: string]: {
    progress: number;
    fileName: string;
  };
}

const useUploadFile = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (
    file: File,
    fileType: 'video' | 'image',
    onProgress?: (progress: number, url?: string) => void
  ): Promise<{ url: string }> => {
    const uploadId = uuidv4(); // Generate unique ID for this upload
    setIsUploading(true);

    try {
      const url = await uploadFileToCloudflare(
        file,
        fileType,
        uploadId,
        onProgress
      );
      return { url };
    } catch (error) {
      // Clean up progress on error
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[uploadId];

        if (Object.keys(updated).length === 0) {
          setIsUploading(false);
        }

        return updated;
      });
      throw error;
    }
  };

  const uploadFileToCloudflare = async (
    file: File,
    fileType: string,
    uploadId: string,
    onProgress?: (progress: number, url?: string) => void
  ): Promise<string> => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const extension = file.name.split('.').pop();
    const uniqueFileName = `${fileType}-${uniqueSuffix}.${extension}`;

    const key = `dev/university/${fileType}/${uniqueFileName}`;

    try {
      // Update progress - starting
      setUploadProgress((prev) => ({
        ...prev,
        [uploadId]: {
          progress: 10,
          fileName: file.name,
        },
      }));
      if (onProgress) onProgress(10);

      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const params = {
        Bucket: R2_BUCKET,
        Key: key,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
      };

      // Upload to Cloudflare R2
      await s3Client.send(new PutObjectCommand(params));
      const url = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;

      // Set final progress to 100%
      setUploadProgress((prev) => ({
        ...prev,
        [uploadId]: {
          progress: 100,
          fileName: file.name,
        },
      }));

      if (onProgress) onProgress(100, url);

      // Clean up progress after a short delay
      setTimeout(() => {
        setUploadProgress((prev) => {
          const updated = { ...prev };
          delete updated[uploadId];

          // If no more uploads in progress, set uploading to false
          if (Object.keys(updated).length === 0) {
            setIsUploading(false);
          }

          return updated;
        });
      }, 500);

      return url;
    } catch (error) {
      console.error(`Error uploading file to Cloudflare R2:`, error);
      throw error;
    }
  };

  // Calculate overall progress across all active uploads
  const getOverallProgress = (): number => {
    const uploads = Object.values(uploadProgress);
    if (uploads.length === 0) return 0;
    const totalProgress = uploads.reduce(
      (sum, upload) => sum + upload.progress,
      0
    );
    return Math.round(totalProgress / uploads.length);
  };

  // Get array of active uploads with their info
  const getActiveUploads = () => {
    return Object.entries(uploadProgress).map(([id, data]) => ({
      id,
      fileName: data.fileName,
      progress: data.progress,
    }));
  };

  // Reset all progress state
  const resetProgress = () => {
    setUploadProgress({});
    setIsUploading(false);
  };

  return {
    uploadFile,
    uploadProgress,
    isUploading,
    overallProgress: getOverallProgress(),
    activeUploads: getActiveUploads(),
    activeUploadCount: Object.keys(uploadProgress).length,
    resetProgress,
  };
};

export default useUploadFile;
