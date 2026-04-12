import React, { useEffect, useRef, useState } from 'react';
import { Check, PenTool, Trash2, Type } from 'lucide-react';
import { Button } from '@nextui-org/react';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  initialSignature?: string;
  width?: number;
  height?: number;
  onGoNext?: () => void;
  onGoBack?: () => void;
  isFirstTab?: boolean;
  isLastTab?: boolean;
  disableActions?: boolean;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  initialSignature = '',
  width = 500,
  height = 200,
  onGoNext,
  onGoBack,
  isFirstTab = false,
  isLastTab = false,
  disableActions = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineColor, setLineColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(2);
  const [hasSignature, setHasSignature] = useState(!!initialSignature);
  const [isSaved, setIsSaved] = useState(!!initialSignature);
  const [savedSignatureData, setSavedSignatureData] = useState<string>(initialSignature || '');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Set background
    ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = 'rgba(113, 113, 122, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [width, height, lineColor, lineWidth]);

  // Load initial signature when component mounts or initialSignature changes
  useEffect(() => {
    if (initialSignature && isSaved && savedSignatureData) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(113, 113, 122, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.onerror = () => {
        console.error('Failed to load signature image');
      };
      img.src = initialSignature;
    }
  }, [initialSignature, isSaved, savedSignatureData]);

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCanvasCoordinates(e);
    setIsDrawing(true);
    setHasSignature(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCanvasCoordinates(e);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(113, 113, 122, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    setHasSignature(false);
  };

  const saveSignature = () => {
    if (!hasSignature) {
      alert('Please draw a signature first');
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureData = canvas.toDataURL('image/png');
    setSavedSignatureData(signatureData);
    onSave(signatureData);
    setIsSaved(true);
  };

  const handleNavigateNext = () => {
    // If already saved, proceed directly
    if (isSaved) {
      onGoNext?.();
      return;
    }
    
    // Otherwise, require a signature before saving and navigating
    if (!hasSignature) {
      alert('Please draw a signature first');
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureData = canvas.toDataURL('image/png');
    onSave(signatureData);
    onGoNext?.();
  };

  const addSampleSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    clearSignature();

    const name = 'John Doe';
    ctx.font = 'italic 32px Brush Script MT, cursive';
    ctx.fillStyle = lineColor;
    ctx.textAlign = 'center';
    ctx.fillText(name, canvas.width / 2, canvas.height / 2 + 10);
    setHasSignature(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <PenTool size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Digital Signature</h3>
            <p className="text-sm text-zinc-400">Draw your signature naturally in the box below</p>
          </div>
        </div>
      </div>

      {/* Canvas Container - Hide when saved */}
      {!isSaved && !disableActions && (
        <div className="relative rounded-lg overflow-hidden border border-zinc-700">
          <canvas
            ref={canvasRef}
            className="w-full cursor-crosshair touch-none bg-zinc-900"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          {/* Drawing Guide */}
          {!hasSignature && (
            <div className="absolute top-3 left-3 text-xs text-zinc-500 bg-black/60 px-2 py-1 rounded">
              Draw your signature here
            </div>
          )}
        </div>
      )}

      {/* Display saved/loaded signature when disableActions is true */}
      {disableActions && savedSignatureData && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Check size={18} />
            <span className="text-sm font-medium">Signature (Read-Only)</span>
          </div>
          <div className="relative rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 p-4">
            <img
              src={savedSignatureData}
              alt="Signature"
              className="w-full h-auto object-contain"
              onError={() => console.error('Failed to display signature image')}
            />
          </div>
        </div>
      )}

      {/* Saved Signature Display - Show when saved and not disabled */}
      {isSaved && savedSignatureData && !disableActions && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Check size={18} />
            <span className="text-sm font-medium">Signature saved successfully!</span>
          </div>
          <div className="relative rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 p-4">
            <img
              src={savedSignatureData}
              alt="Saved Signature"
              className="w-full h-auto object-contain"
            />
          </div>
          <button
            onClick={() => {
              setIsSaved(false);
              setSavedSignatureData('');
              clearSignature();
            }}
            className="w-full px-4 py-2 text-sm bg-zinc-700 text-white hover:bg-zinc-600 rounded-lg font-medium transition-colors"
          >
            Edit Signature
          </button>
        </div>
      )}

      {/* Controls - Hide when saved or disabled */}
      {!isSaved && !disableActions && (
        <div className="space-y-4">
        {/* Brush Size */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-bold text-zinc-400 mb-3">
            Brush Size: {lineWidth}px
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="10"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="flex-1 h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex gap-2">
              {[1, 3, 5, 8, 10].map((size) => (
                <button
                  key={size}
                  onClick={() => setLineWidth(size)}
                  className={`w-8 h-8 rounded flex items-center justify-center transition-colors text-xs font-medium ${
                    lineWidth === size
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  <div
                    className="rounded-full bg-white"
                    style={{ width: Math.min(size, 6), height: Math.min(size, 6) }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-bold text-zinc-400 mb-3">
            Pen Color
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { color: '#FFFFFF', name: 'White' },
              { color: '#000000', name: 'Black' },
              { color: '#3B82F6', name: 'Blue' },
              { color: '#10B981', name: 'Green' },
              { color: '#8B5CF6', name: 'Purple' },
              { color: '#EF4444', name: 'Red' },
            ].map(({ color, name }) => (
              <button
                key={color}
                onClick={() => setLineColor(color)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  lineColor === color
                    ? 'bg-white/20 ring-2 ring-white/40'
                    : 'hover:bg-zinc-800'
                }`}
                title={name}
              >
                <div
                  className="w-5 h-5 rounded border border-white/20"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-zinc-400 whitespace-nowrap">{name}</span>
              </button>
            ))}
          </div>
        </div>
        </div>
      )}

      {/* Action Buttons - Hide when saved or disabled */}
      {!isSaved && !disableActions && (
        <div className="flex gap-3 flex-wrap">
        <button
          onClick={clearSignature}
          className="flex-1 min-w-fit px-4 py-2 text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Clear
        </button>

        <button
          onClick={addSampleSignature}
          className="flex-1 min-w-fit px-4 py-2 text-sm bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Type size={16} />
          Sample
        </button>

        <Button
          onClick={saveSignature}
          disabled={!hasSignature}
          color="primary"
          variant="flat"
          className="flex-1 min-w-fit"
        >
          <Check size={16} />
          Save Signature
        </Button>
      </div>
      )}

      {/* Tips - Hide when saved or disabled */}
      {!isSaved && !disableActions && (
      <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
        <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-2">
          Tips for best results:
        </h4>
        <ul className="text-xs text-zinc-500 space-y-1">
          <li>✓ Sign naturally as you would on paper</li>
          <li>✓ Use a stylus or trackpad for better control</li>
          <li>✓ Keep signature within the drawing area</li>
          <li>✓ Make sure it's clear and consistent</li>
        </ul>
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
            disabled={isLastTab}
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
