import React, { useState, useRef, useEffect } from 'react';
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

import { CaptureStatus } from '../../../lib/types/verification';
import { GlassCard } from './ui/GlassCard';
import { StatusBadge } from './StatusBadge';

export type CameraMode = 'photo' | 'video';

interface CameraFeatureProps {
  onCapture: (data: string | Blob) => void;
  onClose: () => void;
  title?: string;
  description?: string;
  mode?: CameraMode;
}

export const CameraFeature: React.FC<CameraFeatureProps> = ({
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

    setCapturedData(imageData);
    setStatus('success');
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
        setCapturedData(URL.createObjectURL(blob));

        // Pass the blob instead of the URL
        onCapture(blob);
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
        {/* Mode Selection */}
        <div className="flex justify-center gap-3 md:gap-4 mb-4">
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
          <button
            onClick={() => setCameraMode('video')}
            className={`px-4 py-2 rounded-lg transition-all ${
              cameraMode === 'video'
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-white border border-amber-500/30'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Video size={18} className="inline mr-2" />
            Video
          </button>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            {/* Facing Mode Toggle */}
            <button
              onClick={() =>
                _setFacingMode(facingMode === 'user' ? 'environment' : 'user')
              }
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              title="Switch Camera"
            >
              <RotateCw size={20} className="text-white" />
            </button>

            {/* Audio Toggle (for video mode) */}
            {cameraMode === 'video' && (
              <button
                onClick={() => _setWithAudio(!withAudio)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title={withAudio ? 'Mute Audio' : 'Enable Audio'}
              >
                {withAudio ? (
                  <Shield size={20} className="text-green-400" />
                ) : (
                  <Shield size={20} className="text-red-400" />
                )}
              </button>
            )}

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
                {/* Retake */}
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

                {/* Submit */}
                <button
                  onClick={() => capturedData && onCapture(capturedData)}
                  disabled={!capturedData}
                  className="px-4 md:px-8 py-2 md:py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 text-sm md:text-base flex-1 sm:flex-auto justify-center"
                >
                  <CheckCircle size={18} />
                  <span className="hidden sm:inline">Submit Now</span>
                  <span className="sm:hidden">Submit</span>
                </button>
              </>
            ) : cameraMode === 'photo' ? (
              // Capture Photo
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
              // Video Recording
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
      </GlassCard>

      {/* CSS Animation */}
    </div>
  );
};
