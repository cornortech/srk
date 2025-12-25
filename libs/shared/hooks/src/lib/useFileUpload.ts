import { useState } from 'react';

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (selectedFile: File) => {
    setUploading(true);
    setError(null);
    
    try {
      // Implement your file upload logic here
      setFile(selectedFile);
      // await uploadToServer(selectedFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setError(null);
    setUploading(false);
  };

  return { file, uploading, error, uploadFile, reset };
};
