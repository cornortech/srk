import { AlertCircle } from 'lucide-react';
import { GradientText } from './ui/GradientText';
import { GlassCard } from './ui/GlassCard';

interface VerificationRejectedViewProps {
  rejectionReason?: string;
  onSubmitNewRequest: () => void;
  onReturn: () => void;
}

export const VerificationRejectedView = ({ 
  rejectionReason, 
  onSubmitNewRequest, 
  onReturn 
}: VerificationRejectedViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0705] to-black text-white">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <GlassCard className="text-center py-12 px-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle size={48} className="text-red-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">
            <GradientText>Verification Rejected</GradientText>
          </h2>
          <p className="text-gray-400 mb-4 leading-relaxed text-lg">
            Unfortunately, your affiliate verification request was not approved.
          </p>
          {rejectionReason && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8">
              <p className="text-red-300 text-sm">
                <strong>Reason:</strong> {rejectionReason}
              </p>
            </div>
          )}
          <p className="text-gray-400 mb-8 text-sm">
            Please review the requirements and submit a new verification request with the correct information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSubmitNewRequest}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b68938] to-[#e1ba73] text-black font-bold hover:shadow-[0_0_30px_rgba(182,137,56,0.3)] transition-all"
            >
              Submit New Request
            </button>
            <button
              onClick={onReturn}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
            >
              Return to Srk University
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
