import { Camera } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface CaptureOptionsSectionProps {
  onOpenCamera: (type: 'photo' | 'video') => void;
}

export const CaptureOptionsSection = ({ onOpenCamera }: CaptureOptionsSectionProps) => {
  return (
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
          onClick={() => onOpenCamera('photo')}
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
  );
};
