import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

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
    fileType: "video" | "image",
    onProgress?: (progress: number, url?: string) => void
  ): Promise<{ url: string }> => {
    const uploadId = uuidv4(); // Generate unique ID for this upload
    setIsUploading(true);
    
    try {
      const url = await uploadFileToFirebase(
        file, 
        fileType, 
        uploadId,
        onProgress
      );
      return { url };
    } catch (error) {
      // Clean up progress on error
      setUploadProgress(prev => {
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

  const uploadFileToFirebase = (
    file: File,
    fileType: string,
    uploadId: string,
    onProgress?: (progress: number, url?: string) => void
  ): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
      const extension = file.name.split(".").pop();
      const uniqueFileName = `${fileType}-${uniqueSuffix}.${extension}`;

      const storageRef = ref(storage, `/temp/${fileType}/${uniqueFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const roundedProgress = +progress.toFixed(0);
          
          // Update progress for this specific upload
          setUploadProgress(prev => ({
            ...prev,
            [uploadId]: {
              progress: roundedProgress,
              fileName: file.name
            }
          }));
          
          // Call custom progress callback if provided
          if (onProgress) onProgress(roundedProgress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Set final progress to 100%
            setUploadProgress(prev => ({
              ...prev,
              [uploadId]: {
                progress: 100,
                fileName: file.name
              }
            }));
            
            if (onProgress) onProgress(100, downloadURL);

            // Clean up progress after a short delay
            setTimeout(() => {
              setUploadProgress(prev => {
                const updated = { ...prev };
                delete updated[uploadId];
                
                // If no more uploads in progress, set uploading to false
                if (Object.keys(updated).length === 0) {
                  setIsUploading(false);
                }
                
                return updated;
              });
            }, 500);

            resolve(downloadURL);
          }).catch(reject);
        }
      );
    });
  };

  // Calculate overall progress across all active uploads
  const getOverallProgress = (): number => {
    const uploads = Object.values(uploadProgress);
    if (uploads.length === 0) return 0;
    const totalProgress = uploads.reduce((sum, upload) => sum + upload.progress, 0);
    return Math.round(totalProgress / uploads.length);
  };

  // Get array of active uploads with their info
  const getActiveUploads = () => {
    return Object.entries(uploadProgress).map(([id, data]) => ({
      id,
      fileName: data.fileName,
      progress: data.progress
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
    resetProgress
  };
};

export default useUploadFile;