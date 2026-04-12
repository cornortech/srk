import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { Button, Card, Spacer } from "@nextui-org/react";
import { CameraIcon, SkipBack, StepForward, CheckCircle } from "lucide-react";

interface FaceCaptureProps {
  handleTabChange: () => void;
  verificationImage: string | null;
  isInitialVideoOpen?: boolean;
  previousVerificationImage: string | null;
  disableActions: boolean;
  setVerificationImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const WebcamCapture: React.FC<FaceCaptureProps> = ({
  handleTabChange,
  verificationImage,
  isInitialVideoOpen,
  setVerificationImage,
  disableActions,
  previousVerificationImage,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVideo, setShowVideo] = React.useState(false);

  useEffect(() => {
    startWebcam();
    loadModels();
  }, []);

  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

      console.log("Models loaded successfully.");
    } catch (error) {
      console.error("Error loading models", error);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png"); // Get captured image
    setVerificationImage(imageData);
    setShowVideo(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const draw = () => {
        if (videoRef.current) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        }
        requestAnimationFrame(draw);
      };
      draw();
    }
  }, [videoRef.current]);

  useEffect(() => {
    setShowVideo(!!isInitialVideoOpen);
  }, [isInitialVideoOpen]);
  
  const viewImage = verificationImage || previousVerificationImage;

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <CameraIcon size={24} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Photo Verification</h3>
          <p className="text-sm text-zinc-400">Capture a clear selfie for account verification</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2 w-full md:w-96 md:mx-auto">
        <h4 className="text-sm font-semibold text-blue-300">How to take a good selfie:</h4>
        <ul className="text-sm text-blue-200 space-y-1 ml-4">
          <li className="list-disc">Face the camera directly with good lighting</li>
          <li className="list-disc">Ensure your entire face is visible in the frame</li>
          <li className="list-disc">Remove sunglasses and hat if possible</li>
          <li className="list-disc">Keep a neutral expression</li>
        </ul>
      </div>

      {/* Camera Area */}
      <div className="flex flex-col items-center space-y-6 w-full">
        <div className="w-full md:w-96 md:mx-auto">
          <Card className="w-full">
            <div className="relative bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-96 object-cover rounded-lg"
                style={{ display: showVideo ? "block" : "none" }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 hidden"
                style={{ display: "none" }}
              />

              {/* Oval Guide Overlay */}
              {showVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="border-4 border-dashed border-blue-400 rounded-full opacity-75"
                    style={{
                      width: "70%",
                      height: "85%",
                    }}
                  />
                </div>
              )}

              {/* Blur overlay */}
              {showVideo && (
                <div
                  className="absolute top-0 left-0 w-full h-full bg-blue-500"
                  style={{
                    clipPath: "circle(35% at 50% 50%)",
                    filter: "blur(20px)",
                    zIndex: -1,
                  }}
                />
              )}
            </div>
          </Card>
        </div>

        {/* Preview Section */}
        {viewImage && (
          <div className="w-full md:w-96 md:mx-auto space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">Photo captured successfully</span>
            </div>
            <Card className="w-full">
              <div className="p-4">
                <img
                  src={viewImage}
                  alt="Captured Selfie"
                  className="rounded-lg w-full object-cover max-h-96"
                />
              </div>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        {!disableActions &&
          (viewImage && !showVideo ? (
            <div className="flex gap-3 w-full md:w-96 md:mx-auto">
              <Button
                color="primary"
                variant="bordered"
                onPress={() => setShowVideo(true)}
                size="lg"
                className="flex-1"
              >
                <SkipBack size={18} /> Try Again
              </Button>
              <Button
                color="primary"
                variant="shadow"
                onPress={() => {
                  handleTabChange();
                }}
                size="lg"
                className="flex-1"
              >
                Next Step <StepForward size={18} />
              </Button>
            </div>
          ) : (
            <div className="w-full md:w-96 md:mx-auto">
              <Button
                color="primary"
                variant="solid"
                onPress={captureImage}
                size="lg"
                className="w-full"
              >
                <CameraIcon size={18} /> Capture Photo
              </Button>
            </div>
          ))}
      </div>

      {/* Tips */}
      <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg w-full md:w-96 md:mx-auto">
        <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-2">
          Tips for best results:
        </h4>
        <ul className="text-xs text-zinc-500 space-y-1">
          <li>✓ Use natural lighting, avoid backlighting</li>
          <li>✓ Keep the camera steady</li>
          <li>✓ Position your face in the center of the frame</li>
          <li>✓ Make sure there's minimal background clutter</li>
        </ul>
      </div>
    </div>
  );
};

export default WebcamCapture;
