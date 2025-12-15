import React from 'react';
import {
  AlertTriangle,
  Camera,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from 'lucide-react';
import { SelfieStepProps } from './types';

export const SelfieStep: React.FC<SelfieStepProps> = ({
  formData,
  onNext,
  onPrev,
  videoRef,
  canvasRef,
  isCameraActive,
  cameraError,
  onStartCamera,
  onTakePicture,
  onRetake,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">2. Selfie Capture</h2>
      <p className="text-gray-400">
        Please position your face clearly within the frame for a live photo.
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

        {/* Camera loading/error state */}
        {!isCameraActive && !formData.selfieImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 p-4 text-center">
            {cameraError ? (
              <>
                <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
                <p className="text-red-400 font-medium mb-4">{cameraError}</p>
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
              onClick={onStartCamera}
              className="bg-gradient-to-r from-[#ac9976] to-[#e1ba73] hover:opacity-90 text-black font-semibold py-2 px-6 rounded-lg flex items-center transition"
            >
              <Camera className="w-5 h-5 mr-2" /> Start Camera
            </button>
          </div>
        )}

        {/* Selfie preview */}
        {formData.selfieImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90">
            <img
              src={formData.selfieImage}
              alt="Selfie Preview"
              className="max-h-full max-w-full object-contain rounded-xl shadow-xl border-4 border-amber-500"
            />
            <button
              onClick={onRetake}
              className="absolute top-2 right-2 p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onPrev}
          className="text-gray-400 hover:text-white transition px-4 py-2 flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </button>

        {!formData.selfieImage ? (
          <button
            onClick={onTakePicture}
            disabled={!isCameraActive}
            className="p-3 bg-gradient-to-r from-[#ac9976] to-yellow-500 rounded-full hover:opacity-90 disabled:opacity-50 transition shadow-lg"
          >
            <Camera className="w-6 h-6 text-black" />
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-gradient-to-r from-[#ac9976] to-yellow-500 text-black font-medium rounded-lg hover:opacity-90 transition flex items-center"
          >
            Next: Signature <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SelfieStep;
