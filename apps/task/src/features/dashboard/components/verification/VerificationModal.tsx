import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import DashboardGradientText from '../ui/DashboardGradientText';
import {
  DocumentStep,
  SelfieStep,
  SignatureStep,
  DetailsStep,
  ReviewStep,
  VerificationFormData,
} from './steps';

interface VerificationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VerificationFormData>({
    documentFile: null,
    selfieImage: null,
    signature: null,
    fullName: '',
    dob: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    'success' | 'error' | null
  >(null);

  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const totalSteps = 5;

  // Navigation
  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Camera logic
  const startCamera = useCallback(async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setCameraError(null);
    setIsCameraActive(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current
          .play()
          .then(() => {
            setIsCameraActive(true);
            setCameraError(null);
          })
          .catch((e) => {
            console.error('Video Autoplay Blocked:', e);
            setCameraError(
              'Autoplay blocked. Try refreshing or check browser settings.'
            );
          });
      }
    } catch (err: any) {
      console.error('Camera access failed:', err);
      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError'
      ) {
        setCameraError(
          'Camera access denied. Please grant permission in your browser settings.'
        );
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError(`Error: ${err.message}`);
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    if (currentStep === 2 && !formData.selfieImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      if (currentStep === 2) {
        stopCamera();
      }
    };
  }, [currentStep, startCamera, stopCamera, formData.selfieImage]);

  const takePicture = () => {
    if (!isCameraActive || !videoRef.current || !canvasRef.current) {
      setCameraError('Camera not active or stream failed.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setFormData((f) => ({ ...f, selfieImage: dataUrl }));
      stopCamera();
    }
  };

  const handleRetakeSelfie = () => {
    setFormData((f) => ({ ...f, selfieImage: null }));
    startCamera();
  };

  // Form handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((f) => ({ ...f, documentFile: file }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSignatureSave = (signature: string) => {
    setFormData((f) => ({ ...f, signature }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionStatus(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (Math.random() > 0.1) {
      setSubmissionStatus('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } else {
      setSubmissionStatus('error');
    }
    setIsSubmitting(false);
  };

  const handleRetry = () => {
    setSubmissionStatus(null);
    setCurrentStep(4);
  };

  // Render current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DocumentStep
            formData={formData}
            onNext={nextStep}
            onFileChange={handleFileChange}
          />
        );
      case 2:
        return (
          <SelfieStep
            formData={formData}
            onNext={nextStep}
            onPrev={prevStep}
            videoRef={videoRef}
            canvasRef={canvasRef}
            isCameraActive={isCameraActive}
            cameraError={cameraError}
            onStartCamera={startCamera}
            onTakePicture={takePicture}
            onRetake={handleRetakeSelfie}
          />
        );
      case 3:
        return (
          <SignatureStep
            formData={formData}
            onNext={nextStep}
            onPrev={prevStep}
            onSignatureSave={handleSignatureSave}
          />
        );
      case 4:
        return (
          <DetailsStep
            formData={formData}
            onNext={nextStep}
            onPrev={prevStep}
            onInputChange={handleInputChange}
          />
        );
      case 5:
        return (
          <ReviewStep
            formData={formData}
            onNext={() => {}}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
            submissionStatus={submissionStatus}
            onSubmit={handleSubmit}
            onRetry={handleRetry}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-linear-to-br from-[#1a1410]/90 to-[#0a0a0a]/90 border border-amber-500/20 rounded-2xl shadow-2xl">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              <span className="bg-linear-to-r from-[#ac9976] to-[#e1ba73] bg-clip-text text-transparent">
                <DashboardGradientText>
                  Identity Verification
                </DashboardGradientText>
              </span>
            </h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            submissionStatus={submissionStatus}
          />

          {/* Step Content */}
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  submissionStatus: 'success' | 'error' | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  submissionStatus,
}) => (
  <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
    <h2 className="text-lg font-semibold from-[#ac9976] to-[#e1ba73] text-center mb-2">
      Step {currentStep} of {totalSteps - (submissionStatus ? 1 : 0)}
    </h2>
    <div className="w-full bg-white/10 rounded-full h-2.5">
      <div
        className="bg-gradient-to-r from-[#ac9976] to-[#e1ba73] h-2.5 rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(100, (currentStep / totalSteps) * 100)}%`,
        }}
      />
    </div>
  </div>
);

export default VerificationModal;
