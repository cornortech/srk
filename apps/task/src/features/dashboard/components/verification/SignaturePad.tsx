import MagneticButton from '../ui/DashboardMagneticButton';
import DashboardGlassCard from '../ui/DashboardGlassCard';
import { Check, PenTool, Trash2, Type } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
      x: clientX - rect.left,
      y: clientY - rect.top,
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
  };

  return (
    <DashboardGlassCard>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <PenTool size={24} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Digital Signature</h3>
            <p className="text-zinc-400">
              Draw your signature in the box below
            </p>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="relative mb-6">
          <canvas
            ref={canvasRef}
            className="w-full h-48 rounded-lg border-2 border-white/10 cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          {/* Drawing Guide */}
          <div className="absolute top-2 left-2 text-xs text-zinc-500 bg-black/60 px-2 py-1 rounded">
            Draw here
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Brush Size */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-3">
              Brush Size: {lineWidth}px
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              <div className="flex gap-2">
                {[1, 3, 5, 8, 10].map((size) => (
                  <button
                    key={size}
                    onClick={() => setLineWidth(size)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
            <label className="block text-sm font-medium text-zinc-400 mb-3">
              Pen Color
            </label>
            <div className="flex gap-3">
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
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-zinc-400">{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={clearSignature}
              className="flex-1 px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
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

            <MagneticButton onClick={saveSignature} className="flex-1">
              <Check size={18} />
              Save Signature
            </MagneticButton>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="font-medium text-white mb-2">
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
      </div>
    </DashboardGlassCard>
  );
};
