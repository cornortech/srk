import { Navigate, useNavigate } from 'react-router-dom';
import { GradientText } from '../features/verification/components/ui/GradientText';
import { CameraFeature } from '../features/verification/components/CameraFeature';
import { useAuthGrowAffiliate } from '../hooks/getUser';
import { useVerificationForm } from '../features/verification/hooks/useVerificationForm';
import { BackgroundBlobs } from '../features/verification/components/BackgroundBlobs';
import { VerificationSuccessView } from '../features/verification/components/VerificationSuccessView';
import { VerificationPendingView } from '../features/verification/components/VerificationPendingView';
import { VerificationRejectedView } from '../features/verification/components/VerificationRejectedView';
import { RejectionBanner } from '../features/verification/components/RejectionBanner';
import { CaptureOptionsSection } from '../features/verification/components/CaptureOptionsSection';
import { RequirementsSection } from '../features/verification/components/RequirementsSection';
import { MediaPreviewSection } from '../features/verification/components/MediaPreviewSection';
import { SecurityInfoSection } from '../features/verification/components/SecurityInfoSection';

export const GrowVerificationPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = useAuthGrowAffiliate();

  const {
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
  } = useVerificationForm(user?._id);

  // --- AUTH / LOADING UI MUST BE CHECKED ONLY AFTER HOOKS EXECUTED ---
  if (userLoading || checkLoading) {
    return <div className="text-white p-10 text-center">Loading...</div>;
  }

  // Extract backend response
  if (affiliateResp?.status === 200) {
    const affiliateVerification = affiliateResp.body.affiliateVerificationRequest;
    const affiliateUser = affiliateResp.body.affiliateUser;

    // Check if verification is approved
    if (affiliateVerification?.status === 'approved' && affiliateUser) {
      localStorage.setItem('affiliateGrowUserId', affiliateUser._id);
      return <Navigate to="/affiliate/dashboard" replace />;
    }

    // Handle pending status
    if (affiliateVerification?.status === 'pending') {
      return (
        <VerificationPendingView
          onReturn={() => navigate('https://thesrkuniversity.com')}
        />
      );
    }

    // Handle rejected status - only show rejection page if user hasn't started resubmission
    if (
      affiliateVerification?.status === 'rejected' &&
      !isResubmitting &&
      !capturedMedia &&
      submissionStatus !== 'submitting' &&
      submissionStatus !== 'success'
    ) {
      return (
        <VerificationRejectedView
          rejectionReason={affiliateVerification.rejectionReason}
          onSubmitNewRequest={handleResetForm}
          onReturn={() => navigate('https://thesrkuniversity/study')}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0705] to-black text-white">
      <BackgroundBlobs />

      {/* Show success page if verification submitted */}
      {submissionStatus === 'success' ? (
        <VerificationSuccessView onReturnToLogin={() => navigate('/login')} />
      ) : (
        <>
          {/* Main content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
            {/* Show rejection banner if status is rejected */}
            {affiliateResp?.body?.affiliateVerificationRequest?.status === 'rejected' && (
              <RejectionBanner
                rejectionReason={affiliateResp.body.affiliateVerificationRequest.rejectionReason}
              />
            )}

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <GradientText>Advanced Camera Verification</GradientText>
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Capture photos or videos for secure identity verification with live
                preview
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left side */}
              <div className="space-y-8">
                <CaptureOptionsSection onOpenCamera={openCamera} />
                <RequirementsSection />
              </div>

              {/* Right side */}
              <div className="space-y-8">
                <MediaPreviewSection
                  previewUrl={previewUrl}
                  capturedMedia={capturedMedia}
                  mediaType={mediaType}
                  submissionStatus={submissionStatus}
                  isUploading={isUploading}
                  uploadedImageUrl={uploadedImageUrl}
                  isPending={affiliateVerificationMutation.isPending}
                  onSubmit={handleSubmitVerification}
                  onOpenCamera={() => openCamera(mediaType)}
                />
                <SecurityInfoSection />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <CameraFeature
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
          title={`${mediaType === 'photo' ? 'Photo' : 'Video'} Capture`}
          description={`Take a ${mediaType} for verification`}
          mode={mediaType}
        />
      )}
    </div>
  );
};