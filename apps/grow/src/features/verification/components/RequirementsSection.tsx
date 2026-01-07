import { GlassCard } from './ui/GlassCard';

const requirements = [
  'Camera permission must be granted',
  'Good lighting conditions',
  'Stable internet connection',
  'Modern browser with WebRTC support',
  'Minimum 5 seconds for video',
];

export const RequirementsSection = () => {
  return (
    <GlassCard>
      <h3 className="text-xl font-bold text-white mb-4">
        Requirements
      </h3>
      <div className="space-y-3">
        {requirements.map((req, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#b68938]" />
            <span className="text-gray-300">{req}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
