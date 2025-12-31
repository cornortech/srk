import MagneticButton from '../ui/DashboardMagneticButton';
import { Check, PenTool, Trash2, Type } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DashboardGlassCard } from '../ui';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  width?: number;
  height?: number;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  width = 400,
  height = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineColor, setLineColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(2);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Set background
    ctx.fillStyle = 'rgba(26, 20, 16, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [width, height, lineColor, lineWidth]);

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
    ctx.fillStyle = 'rgba(26, 20, 16, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signature = canvas.toDataURL('image/png');
    onSave(signature);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <DashboardGlassCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <PenTool size={20} className="text-blue-400 sm:size-24" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                Digital Signature
              </h3>
              <p className="text-[10px] sm:text-xs text-zinc-400">
                Draw your signature in the box below
              </p>
            </div>
          </div>
          {isSaved && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-in fade-in zoom-in duration-300">
              <Check size={14} className="text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                Saved
              </span>
            </div>
          )}
        </div>

        {/* Canvas Container */}
        <div className="relative mb-4">
          <canvas
            ref={canvasRef}
            className="w-full h-32 sm:h-40 rounded-lg border-2 border-white/10 cursor-crosshair touch-none bg-black/20"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          {/* Drawing Guide */}
          <div className="absolute top-2 left-2 text-sm text-zinc-500 bg-black/60 px-2 py-1 rounded">
            Draw here
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Brush Size */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-3">
              Brush Size: {lineWidth}px
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="flex-1 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              <div className="flex gap-2">
                {[1, 3, 5, 8, 10].map((size) => (
                  <button
                    key={size}
                    onClick={() => setLineWidth(size)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                      lineWidth === size
                        ? 'bg-amber-500/20 border border-amber-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className="rounded-full bg-white"
                      style={{ width: size, height: size }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-3">
              Pen Color
            </label>
            <div className="flex gap-3 overflow-x-auto pb-0.5 scrollbar-hide">
              {[
                { color: '#FFFFFF', name: 'White' },
                { color: '#000000', name: 'Black' },
                { color: '#3B82F6', name: 'Blue' },
                { color: '#10B981', name: 'Green' },
                { color: '#8B5CF6', name: 'Purple' },
                { color: '#EF4444', name: 'Red' },
                { color: '#F59E0B', name: 'Orange' },
                { color: '#06B6D4', name: 'Cyan' },
              ].map(({ color, name }) => (
                <button
                  key={color}
                  onClick={() => setLineColor(color)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                    lineColor === color ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                  title={name}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-zinc-400">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={clearSignature}
            className="flex-1 px-4 py-2 text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Clear
          </button>

          <button
            onClick={() => {
              clearSignature();
              // Add sample signature
              const canvas = canvasRef.current;
              const ctx = canvas?.getContext('2d');
              if (!canvas || !ctx) return;

              const name = 'John Doe';
              ctx.font = 'italic 28px Arial';
              ctx.fillStyle = lineColor;
              ctx.textAlign = 'center';
              ctx.fillText(name, canvas.width / 2, canvas.height / 2);
            }}
            className="flex-1 px-6 py-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Type size={18} />
            Sample
          </button>

          <MagneticButton
            onClick={saveSignature}
            className={`flex-1 transition-all duration-300`}
          >
            <Check size={16} />
            Save Signature
          </MagneticButton>
        </div>

        {/* Instructions - Smaller and less prominent */}
        <div className="p-3 bg-white/5 rounded-lg">
          <h4 className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-2">
            Tips for best results:
          </h4>
          <ul className="text-sm text-zinc-400 space-y-1">
            <li className="flex items-center gap-2">
              <Check size={12} className="text-green-400" />
              Sign naturally as you would on paper
            </li>
            <li className="flex items-center gap-2">
              <Check size={12} className="text-green-400" />
              Use a stylus or your finger for better control
            </li>
            <li className="flex items-center gap-2">
              <Check size={12} className="text-green-400" />
              Make sure your signature is clear and readable
            </li>
            <li className="flex items-center gap-2">
              <Check size={12} className="text-green-400" />
              Keep it within the drawing area
            </li>
          </ul>
        </div>
      </div>
    </DashboardGlassCard>
  );
};
