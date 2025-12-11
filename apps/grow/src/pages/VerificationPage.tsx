import { useState } from 'react';
import {
  Camera,
  CheckCircle,
  Shield,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientText } from '../features/verification/components/ui/GradientText';
import { GlassCard } from '../features/verification/components/ui/GlassCard';
import { CameraFeature } from '../features/verification/components/CameraFeature';

export const GrowVerificationPage = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');

  const handleCapture = (data: string) => {
    setCapturedMedia(data);
    setShowCamera(false);

    // Simulate submission
    setSubmissionStatus('submitting');
    setTimeout(() => {
      setSubmissionStatus('success');
      // Clear success after 3 seconds
      setTimeout(() => setSubmissionStatus('idle'), 3000);
    }, 2000);
  };

  const navigate = useNavigate();

  const openCamera = (type: 'photo' | 'video') => {
    setMediaType(type);
    setShowCamera(true);
  };

  if (submissionStatus === 'success') {
    setTimeout(() => navigate('/'), 3000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0705] to-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[128px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <GradientText>Advanced Camera Verification</GradientText>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Capture photos or videos for secure identity verification with live
            preview
          </p>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Options */}
          <div className="space-y-8">
            <GlassCard>
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#b68938]/20 to-[#e1ba73]/20 flex items-center justify-center">
                  <Camera size={32} className="text-[#e1ba73]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Capture Options
                </h3>
                <p className="text-gray-400">Choose your verification method</p>
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

          {/* Right side - Preview & Status */}
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

              {/* Preview area */}
              <div className="aspect-video bg-black/30 rounded-xl overflow-hidden mb-6 border-2 border-white/10 flex items-center justify-center">
                {capturedMedia && mediaType === 'photo' ? (
                  <img
                    src={capturedMedia}
                    alt="Captured"
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </div>

              {/* Submission status */}
              {submissionStatus !== 'idle' && (
                <div
                  className={`p-4 rounded-xl mb-4 ${
                    submissionStatus === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : submissionStatus === 'error'
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
                    ) : submissionStatus === 'success' ? (
                      <>
                        <CheckCircle size={20} className="text-emerald-400" />
                        <span className="text-emerald-400">
                          Verification submitted successfully!
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

              {/* Action buttons */}
              <div className="space-y-3">
                {capturedMedia ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setCapturedMedia(null)}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        setSubmissionStatus('submitting');
                        setTimeout(() => {
                          setSubmissionStatus('success');
                          setTimeout(() => {
                            setSubmissionStatus('idle');
                            setCapturedMedia(null);
                          }, 2000);
                        }, 1500);
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold hover:shadow-[0_0_30px_rgba(182,137,56,0.3)] transition-all"
                    >
                      Submit Verification
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
                necessary for verification. Your privacy is our top priority.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Camera Feature Modal */}
      {showCamera && (
        <CameraFeature
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
          title={`${mediaType === 'photo' ? 'Photo' : 'Video'} Capture`}
          description={`Take a ${mediaType} for verification`}
        />
      )}
    </div>
  );
};
