import { ref, uploadBytesResumable, getDownloadURL, deleteObject, StorageError } from 'firebase/storage';
import { storage } from '@srk/shared/firebase';
import { v4 as uuidv4 } from 'uuid';
import { useState, useRef, useCallback } from 'react';

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
  const uploadTasksRef = useRef<Map<string, ReturnType<typeof uploadBytesResumable>>>(new Map());
  const progressTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const uploadFile = async (
    file: File,
    fileType: 'video' | 'image',
    onProgress?: (progress: number, url?: string) => void,
    onError?: (error: string) => void
  ): Promise<{ url: string }> => {
    const uploadId = uuidv4();
    setIsUploading(true);

    try {
      // Compress images before upload to reduce Firebase load
      let fileToUpload = file;
      if (fileType === 'image' && file.size > 1024 * 1024) {
        console.log(`📦 Compressing image: ${file.name}`);
        fileToUpload = await compressImage(file);
        console.log(`✅ Compressed from ${file.size} to ${fileToUpload.size} bytes`);
      }

      const url = await uploadFileToFirebaseWithRetry(
        fileToUpload,
        fileType,
        uploadId,
        onProgress,
        onError
      );
      return { url };
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

      // Clear any pending timeouts
      const timeout = progressTimeoutRef.current.get(uploadId);
      if (timeout) {
        clearTimeout(timeout);
        progressTimeoutRef.current.delete(uploadId);
      }

      if (onError) onError(errorMsg);
      throw error;
    }
  };

  const uploadFileToFirebaseWithRetry = (
    file: File,
    fileType: string,
    uploadId: string,
    onProgress?: (progress: number, url?: string) => void,
    onError?: (error: string) => void,
    retryCount = 0
  ): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const MAX_RETRIES = 2;
      const UPLOAD_TIMEOUT = 90000; // 90 seconds timeout
      const STALL_TIMEOUT = 15000; // 15 seconds without progress = stalled
      let lastProgress = 0;
      let uploadCompleted = false;

      const cleanup = () => {
        uploadTasksRef.current.delete(uploadId);
        const timeout = progressTimeoutRef.current.get(uploadId);
        if (timeout) {
          clearTimeout(timeout);
          progressTimeoutRef.current.delete(uploadId);
        }
      };

      const handleStallTimeout = () => {
        const currentProgress = uploadProgress[uploadId]?.progress || 0;
        if (currentProgress === lastProgress && currentProgress < 100 && !uploadCompleted) {
          console.warn(`⚠️ Upload stalled at ${currentProgress}% for ${uploadId}`);
          
          // Cancel the upload
          const uploadTask = uploadTasksRef.current.get(uploadId);
          if (uploadTask) {
            uploadTask.cancel();
          }

          cleanup();
          const errorMsg = 'Upload stalled - connection timeout. Retrying...';
          
          setUploadProgress((prev) => ({
            ...prev,
            [uploadId]: {
              ...prev[uploadId],
              status: 'failed',
              error: errorMsg,
            },
          }));

          if (retryCount < MAX_RETRIES) {
            console.log(`🔄 Retrying upload (attempt ${retryCount + 2}/${MAX_RETRIES + 1})`);
            uploadFileToFirebaseWithRetry(
              file,
              fileType,
              uploadId,
              onProgress,
              onError,
              retryCount + 1
            ).then(resolve).catch(reject);
          } else {
            reject(new Error('Upload timeout after retries'));
          }
        } else {
          lastProgress = currentProgress;
          // Set another stall check
          const newTimeout = setTimeout(handleStallTimeout, STALL_TIMEOUT);
          progressTimeoutRef.current.set(uploadId, newTimeout);
        }
      };

      // Initial stall timeout
      const stallTimeout = setTimeout(handleStallTimeout, STALL_TIMEOUT);
      progressTimeoutRef.current.set(uploadId, stallTimeout);

      // Overall upload timeout
      const uploadTimeoutHandle = setTimeout(() => {
        if (!uploadCompleted) {
          console.error(`❌ Upload timeout (${UPLOAD_TIMEOUT}ms) for ${uploadId}`);
          const uploadTask = uploadTasksRef.current.get(uploadId);
          if (uploadTask) {
            uploadTask.cancel();
          }
          cleanup();
          reject(new Error('Upload timeout'));
        }
      }, UPLOAD_TIMEOUT);

      try {
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
        const extension = file.name.split('.').pop();
        const uniqueFileName = `${fileType}-${uniqueSuffix}.${extension}`;
        const envPrefix = import.meta.env.VITE_FIREBASE_ENV === 'prod' ? 'prod' : 'local_temp';
        const storageRef = ref(
          storage,
          `/${envPrefix}/${appName}/${fileType}/${uniqueFileName}`
        );

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTasksRef.current.set(uploadId, uploadTask);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const roundedProgress = +progress.toFixed(0);

            setUploadProgress((prev) => ({
              ...prev,
              [uploadId]: {
                progress: roundedProgress,
                fileName: file.name,
                status: roundedProgress === 100 ? 'completed' : 'uploading',
                lastProgressTime: Date.now(),
              },
            }));

            if (onProgress) onProgress(roundedProgress);
          },
          (error: Error) => {
            uploadCompleted = true;
            clearTimeout(uploadTimeoutHandle);
            cleanup();
            const storageError = error as StorageError;
            console.error(`❌ Firebase error for ${uploadId}:`, storageError.code, error.message);

            const errorMsg = getErrorMessage(error);
            setUploadProgress((prev) => ({
              ...prev,
              [uploadId]: {
                ...prev[uploadId],
                status: 'failed',
                error: errorMsg,
              },
            }));

            if (retryCount < MAX_RETRIES && isRetryableError(storageError.code)) {
              console.log(`🔄 Retrying after error (attempt ${retryCount + 2}/${MAX_RETRIES + 1})`);
              uploadFileToFirebaseWithRetry(
                file,
                fileType,
                uploadId,
                onProgress,
                onError,
                retryCount + 1
              ).then(resolve).catch(reject);
            } else {
              if (onError) onError(errorMsg);
              reject(error);
            }
          },
          () => {
            uploadCompleted = true;
            clearTimeout(uploadTimeoutHandle);
            
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                setUploadProgress((prev) => ({
                  ...prev,
                  [uploadId]: {
                    progress: 100,
                    fileName: file.name,
                    status: 'completed',
                    lastProgressTime: Date.now(),
                  },
                }));

                if (onProgress) onProgress(100, downloadURL);

                setTimeout(() => {
                  setUploadProgress((prev) => {
                    const updated = { ...prev };
                    delete updated[uploadId];
                    if (Object.keys(updated).length === 0) {
                      setIsUploading(false);
                    }
                    return updated;
                  });
                  cleanup();
                }, 500);

                resolve(downloadURL);
              })
              .catch((error) => {
                console.error(`❌ Failed to get download URL for ${uploadId}:`, error);
                cleanup();
                reject(error);
              });
          }
        );
      } catch (error) {
        clearTimeout(uploadTimeoutHandle);
        cleanup();
        reject(error);
      }
    });
  };

  // Utility functions
  const isRetryableError = (errorCode?: string): boolean => {
    const retryableCodes = [
      'storage/retry-limit-exceeded',
      'storage/network-error',
      'storage/unauthorized',
      'storage/unknown',
    ];
    return !errorCode || retryableCodes.includes(errorCode);
  };

  const getErrorMessage = (error: Error): string => {
    const storageError = error as StorageError;
    const code = storageError?.code;
    const message = error?.message;

    switch (code) {
      case 'storage/unauthorized':
        return 'Authentication failed. Please login again.';
      case 'storage/canceled':
        return 'Upload was canceled.';
      case 'storage/unknown':
        return 'Upload failed - connection issue. Retrying...';
      case 'storage/retry-limit-exceeded':
        return 'Upload failed after multiple retries. Please try again.';
      case 'storage/invalid-argument':
        return 'Invalid file. Please check and try again.';
      case 'storage/server-unavailable':
        return 'Firebase is temporarily unavailable. Retrying...';
      case 'storage/timeout':
        return 'Upload timeout. Retrying...';
      default:
        return message || 'Upload failed. Please try again.';
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
    uploadTasksRef.current.forEach((task) => {
      try {
        task.cancel();
      } catch {
        // Already cancelled
      }
    });
    uploadTasksRef.current.clear();
    progressTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    progressTimeoutRef.current.clear();
  }, []);

  const deleteFile = async (fileUrl: string): Promise<void> => {
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file from Firebase:', error);
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
