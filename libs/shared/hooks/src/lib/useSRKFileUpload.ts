// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { storage } from '@srk/shared/firebase';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { useState, useRef, useCallback } from 'react';

// Cloudflare R2 S3 config
const R2_ACCESS_KEY_ID = 'daf464fc116a11847575b6fbfbac26a0';
const R2_SECRET_ACCESS_KEY = '6414fef2c8ca3715856b08ab2302d1d92e80b7cec32971acc0d85cef559fd4e4';
const R2_ENDPOINT = 'https://5f09c9e5753d5a473d39fed1135fef46.r2.cloudflarestorage.com';
const R2_BUCKET = 'srk'; // Change to your bucket name if different

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
    status: 'pending' | 'uploading' | 'completed' | 'failed' | 'cancelled';
    error?: string;
    lastProgressTime?: number;
  };
}

const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if larger than 1920x1080
        const maxWidth = 1920;
        const maxHeight = 1080;
        if (width > maxHeight || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.85 // 85% quality
        );
      };
    };
  });
};

export const useSRKFileUpload = (appName: string) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);
  // const uploadTasksRef = useRef<Map<string, ReturnType<typeof uploadBytesResumable>>>(new Map());
  const progressTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const uploadFile = async (
    file: File,
    fileType: 'video' | 'image',
    onProgress?: (progress: number, url?: string) => void,
    onError?: (error: string) => void
  ): Promise<{ url: string; key: string }> => {
    const uploadId = uuidv4();
    setIsUploading(true);

    try {
      // Compress images before upload to reduce Cloudflare load
      let fileToUpload = file;
      if (fileType === 'image' && file.size > 1024 * 1024) {
        console.log(`📦 Compressing image: ${file.name}`);
        fileToUpload = await compressImage(file);
        console.log(`✅ Compressed from ${file.size} to ${fileToUpload.size} bytes`);
      }

      // Prepare S3 upload
      const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
      const extension = file.name.split('.').pop();
      const uniqueFileName = `${fileType}-${uniqueSuffix}.${extension}`;
      const envPrefix = import.meta.env?.VITE_FIREBASE_ENV === 'prod' ? 'prod' : 'local_temp';
      const key = `${envPrefix}/${appName}/${fileType}/${uniqueFileName}`;

      // Convert File/Blob to ArrayBuffer
      const arrayBuffer = await fileToUpload.arrayBuffer();
      const params = {
        Bucket: R2_BUCKET,
        Key: key,
        Body: new Uint8Array(arrayBuffer),
        ContentType: fileToUpload.type,
      };

      // S3 upload (no progress events in browser, so just set 100% after upload)
      await s3Client.send(new PutObjectCommand(params));
      const url = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;

      setUploadProgress((prev) => ({
        ...prev,
        [uploadId]: {
          progress: 100,
          fileName: file.name,
          status: 'completed',
          lastProgressTime: Date.now(),
        },
      }));
      setIsUploading(false);
      if (onProgress) onProgress(100, url);
      return { url, key };
    } catch (error) {
      const errorMsg = (error as Error)?.message || 'Upload failed';
      console.error(`❌ Upload error for ${uploadId}:`, errorMsg);
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[uploadId];
        if (Object.keys(updated).length === 0) {
          setIsUploading(false);
        }
        return updated;
      });
      if (onError) onError(errorMsg);
      throw error;
    }
  };

  // REMOVED: uploadFileToFirebaseWithRetry (replaced by direct S3 upload above)



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

  const getActiveUploads = () => {
    return Object.entries(uploadProgress).map(([id, data]) => ({
      id,
      fileName: data.fileName,
      progress: data.progress,
      status: data.status,
      error: data.error,
    }));
  };

  const resetProgress = useCallback(() => {
    setUploadProgress({});
    setIsUploading(false);
    progressTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    progressTimeoutRef.current.clear();
  }, []);

  const deleteFile = async (fileUrl: string): Promise<void> => {
    // fileUrl is the full URL, extract the key after the bucket
    try {
      const url = new URL(fileUrl);
      // /bucket/key -> key
      const key = url.pathname.split('/').slice(2).join('/');
      await s3Client.send(new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      }));
    } catch (error) {
      console.error('Error deleting file from Cloudflare R2:', error);
      throw error;
    }
  };

  const deleteMultipleFiles = async (fileUrls: string[]): Promise<void> => {
    const deletePromises = fileUrls.map(url => deleteFile(url));
    await Promise.all(deletePromises);
  };

  return {
    uploadFile,
    uploadProgress,
    isUploading,
    overallProgress: getOverallProgress(),
    activeUploads: getActiveUploads(),
    activeUploadCount: Object.keys(uploadProgress).length,
    resetProgress,
    deleteFile,
    deleteMultipleFiles,
  };
};

export default useSRKFileUpload;
