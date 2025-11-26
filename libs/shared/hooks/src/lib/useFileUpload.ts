import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { getFirebaseStorage } from '@srk/shared/api';

export const useUploadFile = () => {
  const uploadFile = async (
    file: File,
    fileType: 'video' | 'image', // e.g., "video", "image"
    app: 'bank' | 'university',
    onProgress?: (progress: number, url?: string) => void // Callback for progress and URL
  ): Promise<{ url: string }> => {
    const url = await uploadFileToFirebase(file, fileType, app, onProgress);
    return { url }; // Return object with url property
  };
  return { uploadFile };
};


const uploadFileToFirebase = (
  file: File,
  fileType: string,
  app: 'bank' | 'university',
  onProgress?: (progress: number, url?: string) => void
) => {
  return new Promise<string>((resolve, reject) => {
    const storage = getFirebaseStorage();
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const extension = file.name.split('.').pop(); // get the extension like jpg, png
    const uniqueFileName = `${fileType}-${uniqueSuffix}.${extension}`;

    const storageRef = ref(
      storage,
      `/test/${app}/${fileType}/${uniqueFileName}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Calculate progress as a percentage
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(+progress.toFixed(0)); // Call the callback with progress
      },
      (error) => {
        reject(error); // Reject the promise on error
      },
      () => {
        // Upload completed successfully, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (onProgress) onProgress(100, downloadURL); // Call callback with 100% and URL

          resolve(downloadURL); // Resolve the promise with the URL
        });
      }
    );
  });
};
