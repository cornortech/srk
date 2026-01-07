import { CheckCircle, Shield } from 'lucide-react';
import { GradientText } from './ui/GradientText';
import { GlassCard } from './ui/GlassCard';

interface VerificationSuccessViewProps {
  onReturnToLogin: () => void;
}

export const VerificationSuccessView = ({ onReturnToLogin }: VerificationSuccessViewProps) => {
  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
      <GlassCard className="text-center py-12 px-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle size={48} className="text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-white">
          <GradientText>Verification Submitted!</GradientText>
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed text-lg">
          Your affiliate verification has been submitted successfully. Our admin team will review your application within 24-48 hours. You'll receive an email notification once approved.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-8">
          <Shield size={16} />
          <span>Secure Verification Process</span>
        </div>
        <button
          onClick={onReturnToLogin}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold hover:shadow-[0_0_30px_rgba(182,137,56,0.3)] transition-all"
        >
          Return to Login
        </button>
      </GlassCard>
    </div>
  );
};
