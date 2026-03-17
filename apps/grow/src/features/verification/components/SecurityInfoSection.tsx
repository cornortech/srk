import { Shield } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

export const SecurityInfoSection = () => {
  return (
    <GlassCard>
      <div className="flex items-center gap-3 mb-4">
        <Shield size={20} className="text-emerald-400" />
        <h3 className="text-lg font-bold text-white">
          Security Assurance
        </h3>
      </div>
      <p className="text-gray-400 text-sm">
        All captured media is encrypted end-to-end and processed
        securely. We never store your biometric data longer than
        necessary for verification. Your privacy is our top priority.
      </p>
    </GlassCard>
  );
};
