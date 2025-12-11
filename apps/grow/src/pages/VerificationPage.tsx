import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  CheckCircle,
  X,
  RotateCw,
  Shield,
  Loader2,
  AlertCircle,
  Video,
  Maximize,
  Minimize,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ============= TYPES =============
type CaptureStatus = 'idle' | 'capturing' | 'uploading' | 'success' | 'error';
type CameraMode = 'photo';

// ============= UTILITY COMPONENTS =============

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
}) => {
  return (
    <motion.div
      className={`relative backdrop-blur-md rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-6 ${className}`}
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#b68938]/10 via-transparent to-[#e1ba73]/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
}) => {
  return (
    <span
      className={`bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] bg-clip-text text-transparent animate-gradient ${className}`}
      style={{
        backgroundSize: '200% auto',
      }}
    >
      {children}
    </span>
  );
};

interface StatusBadgeProps {
  status: CaptureStatus;
  message?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, message }) => {
  const config = {
    idle: {
      icon: Camera,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      label: 'Ready',
    },
    capturing: {
      icon: Camera,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      label: 'Capturing',
    },
    uploading: {
      icon: Loader2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      label: 'Uploading',
    },
    success: {
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      label: 'Verified',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      label: 'Failed',
    },
  }[status];

  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} border border-white/10`}
    >
      {status === 'uploading' ? (
        <Loader2 size={14} className={`${config.color} animate-spin`} />
      ) : (
        <Icon size={14} className={config.color} />
      )}
      <span className={`text-sm font-medium ${config.color}`}>
        {message || config.label}
      </span>
    </div>
  );
};

// ============= CAMERA FEATURE COMPONENT =============
interface CameraFeatureProps {
  onCapture: (data: string) => void;
  onClose: () => void;
  title?: string;
  description?: string;
  mode?: CameraMode;
}

const CameraFeature: React.FC<CameraFeatureProps> = ({
  onCapture,
  onClose,
  title = 'Live Camera Capture',
  description = 'Position yourself clearly in the frame',
  mode = 'photo',
}) => {
  const [status, setStatus] = useState<CaptureStatus>('idle');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedData, setCapturedData] = useState<string | null>(null);
  const [facingMode, _setFacingMode] = useState<'user' | 'environment'>('user');
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [withAudio, _setWithAudio] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, _setIsMuted] = useState(true);
  const [cameraMode, setCameraMode] = useState<CameraMode>(mode);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Start camera with video stream
  const startCamera = async () => {
    try {
      setCameraError(null);

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: withAudio,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        // Handle autoplay
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setCameraActive(true);
              console.log(
                'Camera stream active:',
                stream.getVideoTracks()[0].label
              );
            })
            .catch((e) => {
              console.error('Autoplay blocked:', e);
              setCameraError('Click the video to start playback');
              videoRef.current!.controls = true;
            });
        }
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError(
          'Camera access denied. Please allow camera permissions.'
        );
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else if (err.name === 'NotReadableError') {
        setCameraError('Camera is already in use by another application.');
      } else {
        setCameraError(`Camera error: ${err.message}`);
      }
      setCameraActive(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped track: ${track.kind} - ${track.label}`);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);

    // Clear any recording
    if (isRecording) {
      stopRecording();
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) {
      setCameraError('Camera not ready');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError('Camera feed not available');
      return;
    }

    setStatus('capturing');

    // Set canvas to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Add timestamp and watermark
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(10, canvas.height - 40, 200, 30);

    context.font = '14px Arial';
    context.fillStyle = 'white';
    const timestamp = new Date().toLocaleString();
    context.fillText(`Captured: ${timestamp}`, 15, canvas.height - 20);
    context.fillText(
      'SRK Verification',
      canvas.width - 150,
      canvas.height - 20
    );

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedData(imageData);

    // Simulate processing
    setTimeout(() => {
      setStatus('uploading');

      setTimeout(() => {
        setStatus('success');
        // Auto-submit after success
        setTimeout(() => {
          onCapture(imageData);
        }, 1000);
      }, 1500);
    }, 800);
  };

  // Start recording video
  const startRecording = () => {
    if (!streamRef.current || !cameraActive) return;

    recordedChunksRef.current = [];
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm',
        });
        const videoURL = URL.createObjectURL(blob);
        setCapturedData(videoURL);
        setStatus('capturing');
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Recording error:', err);
      setCameraError('Recording not supported in this browser');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Process video
      setStatus('uploading');
      setTimeout(() => {
        setStatus('success');
        // Auto-submit video
        if (capturedData) {
          setTimeout(() => {
            onCapture(capturedData);
          }, 1000);
        }
      }, 2000);
    }
  };

  // Toggle camera (front/back)

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // Initialize camera
  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [facingMode, withAudio]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto">
      <GlassCard
        className="w-full max-w-4xl p-6 md:p-8 relative my-auto"
        hover={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-zinc-400 text-sm">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Camera Preview Container */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 border-2 border-white/10"
        >
          {/* Video Element - Now with proper preview */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className="w-full h-full object-contain bg-black"
            onClick={() => videoRef.current?.play()}
          />

          {/* Canvas for captures (hidden) */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Overlay Guides */}
          {cameraActive && !capturedData && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Face guide frame */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-white/50 rounded-2xl" />

              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white/70" />

              {/* Grid overlay (optional) */}
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-px bg-white absolute left-1/2 transform -translate-x-1/2" />
                <div className="w-full h-px bg-white absolute top-1/2 transform -translate-y-1/2" />
              </div>

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/90 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-white text-sm font-medium">
                    REC • {formatTime(recordTime)}
                  </span>
                </div>
              )}

              {/* Camera info */}
              <div className="absolute bottom-4 left-4 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-full">
                {facingMode === 'user' ? 'Front Camera' : 'Back Camera'}
              </div>
            </div>
          )}

          {/* Captured Preview */}
          {capturedData && (
            <div className="absolute inset-0">
              {cameraMode === 'photo' ? (
                <img
                  src={capturedData}
                  alt="Captured"
                  className="w-full h-full object-contain"
                />
              ) : null}
            </div>
          )}

          {/* Loading/Error States */}
          {!cameraActive && !cameraError && !capturedData && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <Loader2 size={48} className="text-amber-400 animate-spin mb-4" />
              <p className="text-white font-medium">Starting camera...</p>
            </div>
          )}

          {cameraError && !capturedData && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6">
              <AlertCircle size={48} className="text-red-400 mb-4" />
              <p className="text-red-400 font-medium text-center mb-4">
                {cameraError}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-medium rounded-lg hover:opacity-90 transition"
                >
                  Retry Camera
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Camera Controls */}
        <div className="space-y-4 overflow-y-auto max-h-[40vh]">
          {/* Mode Selection */}
          <div className="flex justify-center gap-3 md:gap-4">
            <button
              onClick={() => setCameraMode('photo')}
              className={`px-4 py-2 rounded-lg transition-all ${
                cameraMode === 'photo'
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-white border border-amber-500/30'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Camera size={18} className="inline mr-2" />
              Photo
            </button>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-3">
              {/* Camera Switch */}

              {/* Audio Toggle */}

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize size={20} className="text-white" />
                ) : (
                  <Maximize size={20} className="text-white" />
                )}
              </button>
            </div>

            {/* Main Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto">
              {capturedData ? (
                <>
                  <button
                    onClick={() => {
                      setCapturedData(null);
                      setStatus('idle');
                      startCamera();
                    }}
                    className="px-4 md:px-6 py-2 md:py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors flex items-center gap-2 text-sm md:text-base flex-1 sm:flex-auto justify-center"
                  >
                    <RotateCw size={18} />
                    <span className="hidden sm:inline">Retake</span>
                    <span className="sm:hidden">Retake</span>
                  </button>
                  <button
                    onClick={() => onCapture(capturedData)}
                    className="px-4 md:px-8 py-2 md:py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 text-sm md:text-base flex-1 sm:flex-auto justify-center"
                  >
                    <CheckCircle size={18} />
                    <span className="hidden sm:inline">Submit Now</span>
                    <span className="sm:hidden">Submit</span>
                  </button>
                </>
              ) : cameraMode === 'photo' ? (
                <button
                  onClick={capturePhoto}
                  disabled={!cameraActive}
                  className="px-4 md:px-8 py-2 md:py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-xl font-bold hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2 disabled:opacity-50 text-sm md:text-base flex-1 sm:flex-auto justify-center"
                >
                  <Camera size={18} />
                  <span className="hidden sm:inline">Capture Photo</span>
                  <span className="sm:hidden">Capture</span>
                </button>
              ) : (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!cameraActive}
                  className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm md:text-base flex-1 sm:flex-auto justify-center ${
                    isRecording
                      ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]'
                  } disabled:opacity-50`}
                >
                  {isRecording ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="hidden sm:inline">
                        Stop Recording ({formatTime(recordTime)})
                      </span>
                      <span className="sm:hidden">Stop</span>
                    </>
                  ) : (
                    <>
                      <Video size={18} />
                      <span className="hidden sm:inline">Start Recording</span>
                      <span className="sm:hidden">Record</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center">
            <StatusBadge status={status} />
          </div>

          {/* Instructions */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
              <Shield size={16} className="text-blue-400" />
              Instructions for best results:
            </h4>
            <ul className="text-sm text-zinc-400 space-y-1">
              {cameraMode === 'photo' ? (
                <>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Ensure good lighting - natural light is best
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Position face within the frame guide
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Look directly at the camera
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Keep steady and press capture
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Speak clearly if audio is enabled
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Record in a quiet environment
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Minimum 5 seconds recommended
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Stay within the frame throughout
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* CSS Animation */}
    </div>
  );
};

// ============= MAIN PAGE COMPONENT =============

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
