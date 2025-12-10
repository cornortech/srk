import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  CheckCircle,
  X,
  RotateCw,
  User,
  Shield,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import GlassCard from '../../../components/common/GlassCard';
import { CaptureStatus } from 'apps/task/src/types';
import StatusBadge from '../../../components/common/StatusBadge';
import GradientText from '../../../components/common/GradientText';

export const TaskVerificationPage = () => {
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus>('idle');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      setCameraError(null);

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API not supported in this browser');
        setCameraActive(false);
        return;
      }

      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraActive(true);
          setCameraError(null);
        }
      } catch (permissionErr: any) {
        // Handle permission denied or device not found
        const errorMsg =
          permissionErr.name === 'NotAllowedError'
            ? 'Camera permission denied. Please allow camera access in your browser settings.'
            : permissionErr.name === 'NotFoundError'
            ? 'No camera device found. Please connect a camera.'
            : permissionErr.message || 'Failed to access camera';

        setCameraError(errorMsg);
        setCameraActive(false);
      }
    } catch (err: any) {
      console.error('Camera initialization error:', err);
      setCameraError(err.message || 'Failed to initialize camera');
      setCameraActive(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Capture selfie
  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to data URL
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    setCaptureStatus('capturing');

    // Stop camera after capture
    stopCamera();

    // Simulate processing
    setTimeout(() => {
      setCaptureStatus('uploading');

      // Simulate upload
      setTimeout(() => {
        setCaptureStatus('success');
      }, 2000);
    }, 1000);
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    setCaptureStatus('idle');
    startCamera();
  };

  // Toggle camera (front/back)
  const toggleCamera = async () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    // Stop current stream
    stopCamera();
    // Restart with new facingMode
    setTimeout(() => {
      startCamera();
    }, 300);
  };

  // Handle final submit
  const handleSubmit = () => {
    if (!capturedImage) return;

    // Here you would typically send the image to your backend
    console.log('Submitting selfie:', capturedImage);
    alert('Selfie submitted successfully!');
  };

  // Initialize camera on component mount
  useEffect(() => {
    let isMounted = true;

    const initializeCamera = async () => {
      if (isMounted) {
        // Small delay to ensure component is ready
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (isMounted) {
          startCamera();
        }
      }
    };

    initializeCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []); // Only run on mount, not on facingMode change

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0705] to-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[128px]" />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#e1ba73] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center">
              <Shield size={24} className="text-black" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold">
                SRK <span className="text-[#e1ba73]">Identity</span>{' '}
                Verification
              </h1>
              <p className="text-sm text-gray-400">
                Secure & Instant Verification
              </p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            <GradientText>Live Selfie Capture</GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Take a real-time selfie for identity verification. Ensure good
            lighting and face the camera clearly.
          </motion.p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Instructions & Status */}
          <div className="space-y-8">
            <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <User size={24} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Verification Requirements
                  </h3>
                  <p className="text-sm text-gray-400">
                    Follow these guidelines
                  </p>
                </div>
              </div>

              <ul className="space-y-4">
                {[
                  {
                    icon: CheckCircle,
                    text: 'Face the camera directly',
                    color: 'text-emerald-400',
                  },
                  {
                    icon: CheckCircle,
                    text: 'Ensure good lighting',
                    color: 'text-emerald-400',
                  },
                  {
                    icon: CheckCircle,
                    text: 'Remove sunglasses/hat',
                    color: 'text-emerald-400',
                  },
                  {
                    icon: CheckCircle,
                    text: 'Keep neutral expression',
                    color: 'text-emerald-400',
                  },
                  {
                    icon: CheckCircle,
                    text: 'No other people in frame',
                    color: 'text-emerald-400',
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3"
                  >
                    <item.icon size={18} className={item.color} />
                    <span className="text-gray-300">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Sparkles size={24} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Why Selfie Verification?
                  </h3>
                  <p className="text-sm text-gray-400">Security benefits</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  'Prevents identity fraud',
                  'Ensures real person verification',
                  'Quick and automated process',
                  'Encrypted and secure storage',
                  'One-time verification',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#b68938]" />
                    <span className="text-gray-400 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Status card */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  Verification Status
                </h3>
                <StatusBadge status={captureStatus} />
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: 1,
                    label: 'Camera Access',
                    completed: cameraActive || !!capturedImage,
                  },
                  {
                    step: 2,
                    label: 'Selfie Capture',
                    completed: !!capturedImage,
                  },
                  {
                    step: 3,
                    label: 'Face Verification',
                    completed: captureStatus === 'success',
                  },
                  {
                    step: 4,
                    label: 'Process Complete',
                    completed: captureStatus === 'success',
                  },
                ].map((step) => (
                  <div key={step.step} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                          ? 'bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black'
                          : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle size={16} />
                      ) : (
                        <span className="text-sm font-bold">{step.step}</span>
                      )}
                    </div>
                    <span
                      className={`${
                        step.completed ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right side - Camera Preview */}
          <GlassCard className="lg:col-span-1">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {capturedImage ? 'Selfie Preview' : 'Live Camera'}
              </h3>
              <p className="text-gray-400">
                {capturedImage
                  ? 'Review your captured selfie'
                  : 'Position your face within the frame'}
              </p>
            </div>

            {/* Camera/Preview Container */}
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-black">
              {cameraError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-red-500/10">
                  <AlertCircle size={48} className="text-red-400 mb-4" />
                  <p className="text-red-400 font-medium text-center">
                    {cameraError}
                  </p>
                  <button
                    onClick={startCamera}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black rounded-lg font-bold hover:opacity-90 transition-opacity"
                  >
                    Retry Camera
                  </button>
                </div>
              ) : capturedImage ? (
                <>
                  <img
                    src={capturedImage}
                    alt="Captured selfie"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
                  >
                    <X size={20} className="text-white" />
                  </button>
                </>
              ) : cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Face guide overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-64 rounded-2xl border-2 border-white/30 border-dashed" />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <Loader2
                    size={48}
                    className="text-[#b68938] animate-spin mb-4"
                  />
                  <p className="text-gray-400">Initializing camera...</p>
                </div>
              )}

              {/* Hidden canvas for capture */}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Camera Controls */}
            <div className="space-y-4">
              {capturedImage ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={retakePhoto}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCw size={20} />
                    Retake Photo
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={captureStatus === 'uploading'}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold hover:shadow-[0_0_30px_rgba(182,137,56,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {captureStatus === 'uploading' ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Submit Verification
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={toggleCamera}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCw size={20} />
                    Switch Camera
                  </button>
                  <button
                    onClick={captureSelfie}
                    disabled={!cameraActive}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold hover:shadow-[0_0_30px_rgba(182,137,56,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Camera size={20} />
                    Capture Selfie
                  </button>
                </div>
              )}

              {/* Camera status */}
              {!cameraError && !capturedImage && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    {cameraActive
                      ? 'Camera active • Click Capture when ready'
                      : 'Camera loading...'}
                  </p>
                </div>
              )}

              {/* Progress indicator */}
              {captureStatus === 'uploading' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Verifying face...</span>
                    <span>80%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#b68938] to-[#e1ba73]"
                      initial={{ width: '0%' }}
                      animate={{ width: '80%' }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Security notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Shield size={16} className="text-emerald-400" />
            <span className="text-sm text-emerald-400">
              Your selfie is encrypted and stored securely. We never share your
              biometric data.
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
