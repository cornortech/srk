import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { useSRKFileUpload } from '@srk/shared/hooks';

export const useVerificationForm = (userId: string | undefined) => {
  const { uploadFile, isUploading } = useSRKFileUpload('grow');
  
  const [showCamera, setShowCamera] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadedImageKey, setUploadedImageKey] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [isResubmitting, setIsResubmitting] = useState(false);

  const { data: affiliateResp, isLoading: checkLoading, refetch } =
    api.grow.getSrkGrowAffiliateVerificationRequest.useQuery(
      ['affiliateVerification', userId],
      {
        query: {
          srkUniversityUserId: userId || '',
        },
      }
    );

  const affiliateVerificationMutation =
    api.grow.srkGrowAffiliateVerificationRequest.useMutation({
      onMutate: () => setSubmissionStatus('submitting'),
      onSuccess: async () => {
        setSubmissionStatus('success');
        await refetch();
      },
      onError: () => setSubmissionStatus('error'),
    });

  const handleSubmitVerification = () => {
    if (!capturedMedia) {
      alert('Please capture an image first');
      return;
    }

    affiliateVerificationMutation.mutate({
      body: {
        srkUniversityUserId: userId || '',
          verificationImageUrl: uploadedImageKey,
      },
    });
  };

  const handleResetForm = () => {
    setCapturedMedia(null);
    setPreviewUrl('');
    setUploadedImageKey('');
    setSubmissionStatus('idle');
    setShowCamera(false);
    setIsResubmitting(true);
  };

  const handleCapture = async (data: string | Blob) => {
    try {
      setSubmissionStatus('submitting');

      const file: File =
        data instanceof Blob
          ? new File(
            [data],
            `capture.${mediaType === 'photo' ? 'jpg' : 'webm'}`,
            { type: data.type }
          )
          : base64ToFile(
            data,
            `capture.${mediaType === 'photo' ? 'jpg' : 'webm'}`
          );

      const uploadedFile = await uploadFile(
        file,
        mediaType === 'photo' ? 'image' : 'video'
      );

      setCapturedMedia(file);
      setUploadedImageKey(uploadedFile.key);
      setShowCamera(false);
      setSubmissionStatus('idle');
    } catch (err) {
      console.error(err);
      setSubmissionStatus('error');
    }
  };

  const base64ToFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    return new File([u8arr], filename, { type: mime });
  };

  useEffect(() => {
    if (!capturedMedia) {
      setPreviewUrl('');
      return;
    }
    const objectUrl = URL.createObjectURL(capturedMedia);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [capturedMedia]);

  const openCamera = (type: 'photo' | 'video') => {
    setMediaType(type);
    setShowCamera(true);
  };

  return {
    showCamera,
    setShowCamera,
    capturedMedia,
    previewUrl,
    uploadedImageUrl,
    mediaType,
    submissionStatus,
    isResubmitting,
    isUploading,
    checkLoading,
    affiliateResp,
    affiliateVerificationMutation,
    handleSubmitVerification,
    handleResetForm,
    handleCapture,
    openCamera,
  };
};
