// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { env } from "./env";

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

/**
 * Determines the environment type based on the current URL
 * @returns 'dev' | 'prod'
 */
const getEnvironmentType = (): 'dev' | 'prod' => {
  const hostname = window.location.hostname;
  
  // Check if it's localhost or 127.0.0.1 (development)
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')) {
    return 'dev';
  }
  
  // Otherwise it's production
  return 'prod';
};

/**
 * Determines the app type based on the current URL or port
 * @returns 'university' | 'task' | 'bank'
 */
const getAppType = (): 'university' | 'task' | 'bank' => {
  const pathname = window.location.pathname;
  const port = window.location.port;
  
  // Check based on port number (dev environment)
  if (port === '4200') return 'university';
  if (port === '4400') return 'task';
  if (port === '4300') return 'bank';
  
  // Check based on subdomain or path (prod environment)
  if (pathname.includes('/task')) return 'task';
  if (pathname.includes('/bank')) return 'bank';
  
  // Default to university
  return 'university';
};

/**
 * Generates the Firebase storage path based on environment and app type
 * Format: /{environment}/{appType}/...
 * Examples:
 *   dev/university/kyc/user123/frontImage.jpg
 *   prod/university/kyc/user123/frontImage.jpg
 *   dev/task/submissions/user123/file.pdf
 *   prod/bank/documents/user123/proof.pdf
 */
const generateStoragePath = (category: string, userId: string, filename: string): string => {
  const env = getEnvironmentType();
  const app = getAppType();
  return `${env}/${app}/${category}/${userId}/${filename}`;
};

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param category - Category of the file (e.g., 'kyc', 'submissions', 'documents', 'payments')
 * @param userId - User ID for organizing files
 * @param customFilename - Optional custom filename (defaults to original filename)
 * @returns Promise with download URL and metadata
 */
export const uploadFile = async (
  file: File,
  category: string,
  userId: string,
  customFilename?: string
): Promise<{ url: string; path: string; size: number; type: string }> => {
  try {
    const filename = customFilename || file.name;
    const path = generateStoragePath(category, userId, filename);
    
    const fileRef = ref(storage, path);
    
    // Upload file
    const snapshot = await uploadBytes(fileRef, file, {
      contentType: file.type,
    });
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
      size: snapshot.metadata.size || file.size,
      type: snapshot.metadata.contentType || file.type,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Upload multiple files to Firebase Storage
 * @param files - Array of files to upload
 * @param category - Category of the files
 * @param userId - User ID
 * @returns Promise with array of upload results
 */
export const uploadMultipleFiles = async (
  files: File[],
  category: string,
  userId: string
): Promise<Array<{ url: string; path: string; size: number; type: string; filename: string }>> => {
  try {
    const uploadPromises = files.map((file) =>
      uploadFile(file, category, userId).then((result) => ({
        ...result,
        filename: file.name,
      }))
    );
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param filePath - Full path to the file (e.g., from uploadFile result)
 * @returns Promise<void>
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get the current environment and app info
 * Useful for debugging or displaying info
 */
export const getStorageConfig = () => ({
  environment: getEnvironmentType(),
  app: getAppType(),
  baseUrl: `${getEnvironmentType()}/${getAppType()}`,
});
