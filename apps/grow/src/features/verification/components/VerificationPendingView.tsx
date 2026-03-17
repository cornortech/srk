import { Loader2, Shield } from 'lucide-react';
import { GradientText } from './ui/GradientText';
import { GlassCard } from './ui/GlassCard';

interface VerificationPendingViewProps {
  onReturn: () => void;
}

export const VerificationPendingView = ({ onReturn }: VerificationPendingViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0705] to-black text-white">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <GlassCard className="text-center py-12 px-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Loader2 size={48} className="text-yellow-400 animate-spin" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">
            <GradientText>Verification Pending</GradientText>
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed text-lg">
            Your affiliate verification is currently under review by our admin team.
            This process typically takes 24-48 hours. You'll receive an email notification once your application is reviewed.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-400 mb-8">
            <Shield size={16} />
            <span>Under Review</span>
          </div>
          <button
            onClick={onReturn}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold hover:shadow-[0_0_30px_rgba(182,137,56,0.3)] transition-all"
          >
            Return to Srk University
          </button>
        </GlassCard>
      </div>
    </div>
  );
};
