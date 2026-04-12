import React, { useRef, useState } from 'react';
import { Fingerprint, Upload, X, Check } from 'lucide-react';
import { Button } from '@nextui-org/react';

interface FingerprintCaptureProps {
  onSave: (leftThumb: string, rightThumb: string) => void;
  leftThumbInitial?: string;
  rightThumbInitial?: string;
  onGoNext?: () => void;
  onGoBack?: () => void;
  isFirstTab?: boolean;
  isLastTab?: boolean;
  disableActions?: boolean;
}

export const FingerprintCapture: React.FC<FingerprintCaptureProps> = ({
  onSave,
  leftThumbInitial = '',
  rightThumbInitial = '',
  onGoNext,
  onGoBack,
  isFirstTab = false,
  isLastTab = false,
  disableActions = false,
}) => {
  const leftInputRef = useRef<HTMLInputElement>(null);
  const rightInputRef = useRef<HTMLInputElement>(null);
  
  const [leftThumb, setLeftThumb] = useState<string>(leftThumbInitial);
  const [rightThumb, setRightThumb] = useState<string>(rightThumbInitial);
  const [leftPreview, setLeftPreview] = useState<string>(leftThumbInitial);
  const [rightPreview, setRightPreview] = useState<string>(rightThumbInitial);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    side: 'left' | 'right'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (side === 'left') {
        setLeftThumb(base64);
        setLeftPreview(base64);
      } else {
        setRightThumb(base64);
        setRightPreview(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNavigateNext = () => {
    if (!leftThumb || !rightThumb) {
      alert('Please upload both left and right thumb fingerprints');
      return;
    }
    // Auto-save fingerprints to parent state
    onSave(leftThumb, rightThumb);
    onGoNext?.();
  };

  const clearSide = (side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftThumb('');
      setLeftPreview('');
      if (leftInputRef.current) leftInputRef.current.value = '';
    } else {
      setRightThumb('');
      setRightPreview('');
      if (rightInputRef.current) rightInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Fingerprint size={20} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Fingerprint Verification</h3>
          <p className="text-sm text-zinc-400">Upload clear photos of your left and right thumbprints</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-semibold text-blue-300">How to capture good fingerprints:</h4>
        <ul className="text-sm text-blue-200 space-y-1 ml-4">
          <li className="list-disc">Place your thumb flat on a white surface</li>
          <li className="list-disc">Ensure good lighting and clear focus</li>
          <li className="list-disc">The entire fingerprint should be visible</li>
          <li className="list-disc">Avoid shadows and reflections</li>
        </ul>
      </div>

      {/* Fingerprint Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Thumb */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white">Left Thumb</label>
          
          {/* Upload/Preview Area */}
          <div
            onClick={() => !disableActions && !leftPreview && leftInputRef.current?.click()}
            className={`relative w-full aspect-square rounded-lg border-2 border-dashed rounded-lg overflow-hidden group ${
              disableActions
                ? 'cursor-not-allowed border-zinc-700 bg-zinc-900/20 opacity-60'
                : 'border-zinc-600 hover:border-blue-500 bg-zinc-900/50 hover:bg-zinc-900/80 cursor-pointer transition-all'
            }`}
          >
            {leftPreview ? (
              <>
                <img
                  src={leftPreview}
                  alt="Left Thumb Preview"
                  className="w-full h-full object-cover"
                />
                {!disableActions && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        leftInputRef.current?.click();
                      }}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Change
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <Upload size={32} className="text-zinc-500 mb-2" />
                <p className="text-sm text-zinc-400 text-center">Click to upload left thumb</p>
                <p className="text-xs text-zinc-500 mt-1">PNG, JPG, GIF max. 25MB</p>
              </div>
            )}
            <input
              ref={leftInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'left')}
              disabled={disableActions}
              className="hidden"
            />
          </div>

          {/* Clear Button */}
          {leftPreview && !disableActions && (
            <button
              onClick={() => clearSide('left')}
              className="w-full px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>

        {/* Right Thumb */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white">Right Thumb</label>
          
          {/* Upload/Preview Area */}
          <div
            onClick={() => !disableActions && !rightPreview && rightInputRef.current?.click()}
            className={`relative w-full aspect-square rounded-lg border-2 border-dashed rounded-lg overflow-hidden group ${
              disableActions
                ? 'cursor-not-allowed border-zinc-700 bg-zinc-900/20 opacity-60'
                : 'border-zinc-600 hover:border-blue-500 bg-zinc-900/50 hover:bg-zinc-900/80 cursor-pointer transition-all'
            }`}
          >
            {rightPreview ? (
              <>
                <img
                  src={rightPreview}
                  alt="Right Thumb Preview"
                  className="w-full h-full object-cover"
                />
                {!disableActions && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        rightInputRef.current?.click();
                      }}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Change
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <Upload size={32} className="text-zinc-500 mb-2" />
                <p className="text-sm text-zinc-400 text-center">Click to upload right thumb</p>
                <p className="text-xs text-zinc-500 mt-1">PNG, JPG, GIF max. 25MB</p>
              </div>
            )}
            <input
              ref={rightInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'right')}
              disabled={disableActions}
              className="hidden"
            />
          </div>

          {/* Clear Button */}
          {rightPreview && !disableActions && (
            <button
              onClick={() => clearSide('right')}
              className="w-full px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      {leftThumb && rightThumb && (
        <div className="flex items-center gap-2 text-emerald-400">
          <Check size={16} />
          <span className="text-sm font-medium">Both fingerprints ready</span>
        </div>
      )}

      {/* Navigation Buttons - Hide when disableActions is true */}
      {!disableActions && (
        <div className="flex gap-3 mt-8 pt-6 border-t border-zinc-700">
          <Button
            onClick={onGoBack}
            disabled={isFirstTab}
            color="primary"
            variant="bordered"
            size="lg"
          >
            ← Go Back
          </Button>
          <div className="flex-1" />
          <Button
            onClick={handleNavigateNext}
            disabled={isLastTab || !leftThumb || !rightThumb}
            color="primary"
            variant="shadow"
            size="lg"
          >
            Next Step →
          </Button>
        </div>
      )}
    </div>
  );
};
