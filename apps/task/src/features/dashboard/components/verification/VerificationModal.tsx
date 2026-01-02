import {
  AlertTriangle,
  Camera,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
  Upload,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SignaturePad } from './SignaturePad';
import DashboardGradientText from '../ui/DashboardGradientText';
import { useSRKFileUpload } from '../../../../../../../libs/shared/hooks/src/lib/useSRKFileUpload';
import { api } from '../../../../lib/api';
import useTaskAuthStore from '../../../../store/useTaskAuthStore';

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

interface VerificationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const { universityID } = useTaskAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const { mutateAsync: submitVerification } =
    api.srkTask.submitSrkTaskOnboardingVerification.useMutation();
  const [formData, setFormData] = useState({
    documentFile: null as File | null,
    selfieImage: null as string | null,
    signature: null as string | null,
    fullName: '',
    dob: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    'success' | 'error' | null
  >(null);
  const { uploadFile } = useSRKFileUpload('task');

  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const totalSteps = 5;
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
    if (!universityID) {
      console.error('No User ID available for submission');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      // 1. Upload files
      const [docRes, selfieRes, sigRes] = await Promise.all([
        uploadFile(formData.documentFile!, 'image'),
        uploadFile(dataURLtoFile(formData.selfieImage!, 'selfie.png'), 'image'),
        uploadFile(
          dataURLtoFile(formData.signature!, 'signature.png'),
          'image'
        ),
      ]);

      // 2. Submit to backend
      const response = await submitVerification({
        params: { srkUniversityId: universityID },
        body: {
          documentUrl: docRes.url,
          verificationImageUrl: selfieRes.url,
          signatureUrl: sigRes.url,
          fullName: formData.fullName,
          dateOfBirth: formData.dob,
        },
      });

      if (response.status === 201) {
        setSubmissionStatus('success');
        setCurrentStep(totalSteps);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Verification submission failed:', error);
      setSubmissionStatus('error');
      setCurrentStep(totalSteps);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">
              1. Upload Document
            </h2>
            <p className="text-gray-400">
              Please upload a valid government-issued ID (e.g., Passport,
              Driver's License).
            </p>

            <div
              className="border-2 border-dashed border-[#ac9976] rounded-lg p-8 text-center bg-gray-700/50 cursor-pointer"
              onClick={() => document.getElementById('documentUpload')?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-3" />

              <input
                id="documentUpload"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <p className="text-amber-400 font-medium">
                {formData.documentFile
                  ? formData.documentFile.name
                  : 'Click to select file'}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                PDF or image files up to 5MB.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={nextStep}
                disabled={!formData.documentFile}
                className="px-6 py-2 bg-gradient-to-r from-[#ac9976] to-[#e1ba73] text-black font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next: Selfie <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">
              2. Selfie Capture
            </h2>
            <p className="text-gray-400">
              Please position your face clearly within the frame for a live
              photo.
            </p>

            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  isCameraActive ? 'opacity-100' : 'opacity-10'
                }`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {!isCameraActive && !formData.selfieImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 p-4 text-center">
                  {cameraError ? (
                    <>
                      <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
                      <p className="text-red-400 font-medium mb-4">
                        {cameraError}
                      </p>
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                      <p className="text-white font-medium mb-4">
                        Initializing camera...
                      </p>
                    </>
                  )}
                  <button
                    onClick={startCamera}
                    className="bg-gradient-to-r from-[#ac9976] to-[#e1ba73] hover:opacity-90 text-black font-semibold py-2 px-6 rounded-lg flex items-center transition"
                  >
                    <Camera className="w-5 h-5 mr-2" /> Start Camera
                  </button>
                </div>
              )}

              {formData.selfieImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90">
                  <img
                    src={formData.selfieImage}
                    alt="Selfie Preview"
                    className="max-h-full max-w-full object-contain rounded-xl shadow-xl border-4 border-amber-500"
                  />
                  <button
                    onClick={() => {
                      setFormData((f) => ({ ...f, selfieImage: null }));
                      startCamera();
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={prevStep}
                className="text-gray-400 hover:text-white transition px-4 py-2 flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </button>

              {!formData.selfieImage ? (
                <button
                  onClick={takePicture}
                  disabled={!isCameraActive}
                  className="p-3 bg-gradient-to-r from-[#ac9976] to-yellow-500 rounded-full hover:opacity-90 disabled:opacity-50 transition shadow-lg"
                >
                  <Camera className="w-6 h-6 text-black" />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-[#ac9976] to-yellow-500 text-black font-medium rounded-lg hover:opacity-90 transition flex items-center"
                >
                  Next: Signature <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">
              3. Digital Signature
            </h2>
            <p className="text-gray-400">
              Draw your signature in the box below
            </p>

            <SignaturePad onSave={handleSignatureSave} />

            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="text-gray-400 hover:text-white transition px-4 py-2 flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </button>
              <button
                onClick={nextStep}
                disabled={!formData.signature}
                className="px-6 py-2 bg-gradient-to-r from-[#ac9976] to-[#e1ba73] text-black font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next: Details
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">
              4. Personal Details
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name (as per ID)"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-amber-500/50 focus:border-amber-500/50"
              />
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={formData.dob}
                onChange={handleInputChange}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-amber-500/50 focus:border-amber-500/50 cursor-pointer"
              />

              {/* Signature Preview */}
              {formData.signature && (
                <div>
                  <p className="text-gray-400 mb-2">Signature Preview:</p>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <img
                      src={formData.signature}
                      alt="Signature Preview"
                      className="h-20 mx-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="text-gray-400 hover:text-white transition px-4 py-2 flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </button>
              <button
                onClick={nextStep}
                disabled={
                  !formData.fullName || !formData.dob || !formData.signature
                }
                className="px-6 py-2 bg-gradient-to-r from-[#ac9976] to-[#e1ba73]  text-black font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next: Review <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            {!submissionStatus && (
              <>
                <h2 className="text-xl font-semibold text-white">
                  5. Review and Submit
                </h2>
                <div className="space-y-3 p-4 bg-white/5 rounded-lg">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-400">
                      Document:
                    </span>{' '}
                    <span className="text-white ml-2">
                      {formData.documentFile?.name || 'Missing'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-400">Selfie:</span>
                    <span className="text-white ml-2">
                      {formData.selfieImage ? 'Captured' : 'Missing'}
                    </span>
                    {formData.selfieImage && (
                      <img
                        src={formData.selfieImage}
                        alt="Selfie"
                        className="w-16 h-auto mt-2 rounded-md border border-amber-500"
                      />
                    )}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-400">
                      Signature:
                    </span>
                    <span className="text-white ml-2">
                      {formData.signature ? 'Provided' : 'Missing'}
                    </span>
                    {formData.signature && (
                      <img
                        src={formData.signature}
                        alt="Signature"
                        className="w-32 h-auto mt-2 rounded-md border border-amber-500"
                      />
                    )}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-400">Name:</span>{' '}
                    <span className="text-white ml-2">
                      {formData.fullName || 'Missing'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-400">DOB:</span>{' '}
                    <span className="text-white ml-2">
                      {formData.dob || 'Missing'}
                    </span>
                  </div>
                  <div className="text-sm text-amber-400 pt-3 italic">
                    I confirm that all information provided is accurate and
                    true.
                  </div>
                </div>
              </>
            )}

            {submissionStatus === 'success' ? (
              <div className="text-center p-6 bg-linear-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl">
                <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Verification Submitted
                </h3>
                <p className="text-gray-400">
                  Your identity verification is under review. This may take 1-2
                  business days.
                </p>
                <div className="mt-4 text-sm text-emerald-400">
                  Redirecting to Tasks tab...
                </div>
              </div>
            ) : submissionStatus === 'error' ? (
              <div className="text-center p-6 bg-linear-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
                <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Submission Failed
                </h3>
                <p className="text-gray-400 mb-6">
                  An error occurred. Please check your connection and try again.
                </p>
                <button
                  onClick={() => setSubmissionStatus(null)}
                  className="px-6 py-2 bg-linear-to-r from-amber-500 to-yellow-500 text-black font-medium rounded-lg hover:opacity-90 transition"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setSubmissionStatus(null);
                    setCurrentStep(4);
                  }}
                  className="px-6 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition"
                >
                  Go Back to Edit
                </button>
              </div>
            ) : (
              <div className="flex justify-between pt-4">
                <button
                  onClick={prevStep}
                  className="text-gray-400 hover:text-white transition px-4 py-2 flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !formData.documentFile ||
                    !formData.selfieImage ||
                    !formData.signature ||
                    !formData.fullName ||
                    !formData.dob
                  }
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{' '}
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Submit Verification
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm overflow-y-auto cursor-default">
      <div className="w-full max-w-2xl bg-linear-to-br from-[#1a1410]/95 to-[#0a0a0a]/95 border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-8 max-h-[95vh] flex flex-col">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
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
          {!submissionStatus && (
            <div className="mb-6 p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
              <h2 className="text-sm font-semibold from-[#ac9976] to-[#e1ba73] text-center mb-2 text-white">
                Step {currentStep} of {totalSteps}
              </h2>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-[#ac9976] to-[#e1ba73] h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (currentStep / totalSteps) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Content Area - Scrollable */}
          <div className="overflow-y-auto pr-1 -mr-1 custom-scrollbar">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
