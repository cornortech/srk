import { useState, useEffect } from 'react';
import {
  Camera,
  CheckCircle,
  Shield,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GradientText } from '../features/verification/components/ui/GradientText';
import { GlassCard } from '../features/verification/components/ui/GlassCard';
import { CameraFeature } from '../features/verification/components/CameraFeature';
import { api } from '../lib/api';
import { useSRKFileUpload } from '@srk/shared/hooks';
import { useAuthGrowAffiliate } from '../hooks/getUser';

export const GrowVerificationPage = () => {
  const { uploadFile, isUploading } = useSRKFileUpload('grow');
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = useAuthGrowAffiliate();

  // --- ALL HOOKS MUST STAY ABOVE ANY CONDITIONAL RETURN ---
  const [showCamera, setShowCamera] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');

  const { data: affiliateResp, isLoading: checkLoading } =
    api.grow.getSrkGrowAffiliateVerificationRequest.useQuery(
      ['affiliateVerification', user?._id],
      {
        query: {
          srkUniversityUserId: user?._id || '',
        },
      }
    );

  const affiliateVerificationMutation =
    api.grow.srkGrowAffiliateVerificationRequest.useMutation({
      onMutate: () => setSubmissionStatus('submitting'),
      onSuccess: () => {
        setSubmissionStatus('success');
        // Stay on the same page to show success message
        // User will see "Verification submitted successfully!" message
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
        srkUniversityUserId: user?._id || '',
        verificationImageUrl: uploadedImageUrl,
      },
    });
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

      const uploadedUrl = await uploadFile(
        file,
        mediaType === 'photo' ? 'image' : 'video'
      );

      setCapturedMedia(file);
      setUploadedImageUrl(uploadedUrl.url);
      setShowCamera(false);
      setSubmissionStatus('idle');
    } catch (err) {
      console.error(err);
      setSubmissionStatus('error');
    }
  };

  // Convert base64 → File
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

  // if (!isAuthenticated || !user) {
  //   return <Navigate to="/login" replace />;
  // }
  useEffect(() => {
    // Extract backend response
    if (!checkLoading && affiliateResp?.status === 200) {
      const affiliateVerification =
        affiliateResp.body.affiliateVerificationRequest;
      const affiliateUser = affiliateResp.body.affiliateUser;

      console.log('debug 2 - Verification request:', affiliateVerification);
      console.log('debug 2 - Affiliate user:', affiliateUser);

      // Check if verification is approved
      if (affiliateVerification?.status === 'approved' && affiliateUser) {
        localStorage.setItem('affiliateGrowUserId', affiliateUser._id);
        console.log(
          'debug 3 - Redirecting to dashboard with userId:',
          affiliateUser._id
        );
        navigate('/affiliate/dashboard', { replace: true });
      }
    }
  }, [checkLoading, affiliateResp, navigate]);

  // --- AUTH / LOADING UI MUST BE CHECKED ONLY AFTER HOOKS EXECUTED ---
  if (userLoading) {
    return <div className="text-white p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0705] to-black text-white">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[128px]" />
      </div>

      {/* Show success page if verification submitted */}
      {submissionStatus === 'success' ? (
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
          <GlassCard className="text-center py-12 px-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle size={48} className="text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">
              <GradientText>Verification Submitted!</GradientText>
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
              Your affiliate verification has been submitted successfully. Our
              admin team will review your application within 24-48 hours. You'll
              receive an email notification once approved.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-8">
              <Shield size={16} />
              <span>Secure Verification Process</span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold hover:shadow-[0_0_30px_rgba(182,137,56,0.3)] transition-all"
            >
              Return to Login
            </button>
          </GlassCard>
        </div>
      ) : (
        <>
          {/* Main content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <GradientText>Advanced Camera Verification</GradientText>
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Capture photos or videos for secure identity verification with
                live preview
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left side */}
              <div className="space-y-8">
                <GlassCard>
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#b68938]/20 to-[#e1ba73]/20 flex items-center justify-center">
                      <Camera size={32} className="text-[#e1ba73]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Capture Options
                    </h3>
                    <p className="text-gray-400">
                      Choose your verification method
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => openCamera('photo')}
                      className="p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border border-amber-500/20 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-amber-500/30 to-yellow-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Camera size={24} className="text-amber-400" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-lg font-bold text-white">
                            Photo Verification
                          </h4>
                          <p className="text-sm text-gray-400">
                            Take a single photo for quick verification
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </GlassCard>

                {/* Requirements */}
                <GlassCard>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Requirements
                  </h3>
                  <div className="space-y-3">
                    {[
                      'Camera permission must be granted',
                      'Good lighting conditions',
                      'Stable internet connection',
                      'Modern browser with WebRTC support',
                      'Minimum 5 seconds for video',
                    ].map((req, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#b68938]" />
                        <span className="text-gray-300">{req}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Right side */}
              <div className="space-y-8">
                <GlassCard>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {capturedMedia ? 'Captured Media' : 'Live Preview'}
                    </h3>
                    <p className="text-gray-400">
                      {capturedMedia
                        ? 'Your submission is ready'
                        : 'Capture will appear here'}
                    </p>
                  </div>

                  <div className="aspect-video bg-black/30 rounded-xl overflow-hidden mb-6 border-2 border-white/10 flex items-center justify-center">
                    {previewUrl && mediaType === 'photo' ? (
                      <img
                        src={previewUrl}
                        alt="Captured"
                        className="w-full h-full object-contain"
                      />
                    ) : null}
                  </div>

                  {submissionStatus !== 'idle' &&
                    submissionStatus !== 'success' && (
                      <div
                        className={`p-4 rounded-xl mb-4 ${
                          submissionStatus === 'error'
                            ? 'bg-red-500/10 border border-red-500/20'
                            : 'bg-blue-500/10 border border-blue-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {submissionStatus === 'submitting' ? (
                            <>
                              <Loader2
                                size={20}
                                className="text-blue-400 animate-spin"
                              />
                              <span className="text-blue-400">
                                Submitting verification...
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={20} className="text-red-400" />
                              <span className="text-red-400">
                                Submission failed. Please try again.
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                  <div className="space-y-3">
                    {capturedMedia ? (
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          className="bg-orange-500 text-white"
                          onClick={handleSubmitVerification}
                          disabled={
                            affiliateVerificationMutation.isPending ||
                            isUploading ||
                            !uploadedImageUrl
                          }
                        >
                          {isUploading
                            ? 'Uploading...'
                            : affiliateVerificationMutation.isPending
                            ? 'Submitting...'
                            : 'Submit Verification'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openCamera(mediaType)}
                        className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold hover:shadow-[0_0_30px_rgba(182,137,56,0.3)] transition-all flex items-center justify-center gap-2"
                      >
                        <Camera size={20} />
                        Open Camera
                      </button>
                    )}
                  </div>
                </GlassCard>

                {/* Security Info */}
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <Shield size={20} className="text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">
                      Security Assurance
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    All captured media is encrypted end-to-end and processed
                    securely. We never store your biometric data longer than
                    necessary for verification. Your privacy is our top
                    priority.
                  </p>
                </GlassCard>
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
