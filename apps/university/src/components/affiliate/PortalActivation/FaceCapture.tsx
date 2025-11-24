import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { Button, Card, Spacer } from "@nextui-org/react";
import { CameraIcon, SkipBack, StepForward } from "lucide-react";

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
    <div className="flex flex-col items-center space-y-6 p-6  w-full">
      <Card>
        <div className="relative">
          {
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-96 h-72 rounded-lg shadow-lg"
              style={{ display: showVideo ? "block" : "none" }}
            />
          }
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 hidden"
            style={{ display: "none" }}
          />

          {/* Vertical Oval guide */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-dashed border-white rounded-full"
            style={{
              width: "50%", // Adjust width as needed
              height: "80%", // Adjust height to fit head vertically
              boxSizing: "border-box",
            }}
          />

          {/* Blue blur effect outside the oval */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-blue-500"
            style={{
              clipPath: "circle(40% at 50% 50%)", // Clip to circle, leaving the middle clear
              filter: "blur(15px)", // Blur effect outside the circle
              zIndex: -1, // Ensures the blur is behind the video
            }}
          />
        </div>
      </Card>

      <Spacer y={1} />

      {viewImage && (
        <Card className="w-[30%]">
          <div className="p-4">
            <img
              src={viewImage}
              alt="Captured"
              className="rounded-lg shadow-lg mx-auto"
              width="100%"
            />
          </div>
        </Card>
      )}

      <Spacer y={1} />

      {!disableActions &&
        (viewImage && !showVideo ? (
          <div className="flex space-x-4">
            <Button
              color="primary"
              variant="bordered"
              onPress={() => setShowVideo(true)}
              size="lg"
            >
              <SkipBack /> Try Again
            </Button>
            <Button
              color="primary"
              variant="shadow"
              onPress={() => {
                handleTabChange();
              }}
              size="lg"
            >
              Next Step <StepForward />
            </Button>
          </div>
        ) : (
          <div>
            <Button
              color="primary"
              variant="solid"
              onPress={captureImage}
              size="lg"
            >
              <CameraIcon /> Capture Photo
            </Button>
          </div>
        ))}
    </div>
  );
};

export default WebcamCapture;
