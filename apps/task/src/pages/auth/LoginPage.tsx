import { ArrowRight, Shield } from 'lucide-react';
import { env } from '../../lib/env';

export const LoginPage = () => {
  const handleGoToUniversity = () => {
    window.location.href = `${env.universityUrl}/auth/login`;
  };

  return (
    <div className="min-h-screen bg-[#0a0705] flex items-center justify-center px-6">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#b68938]/[0.06] rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e1ba73] to-[#b68938] shadow-[0_4px_20px_rgba(182,137,56,0.5)] mb-5">
            <span className="font-black text-black text-xl select-none">S</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">SRK Task</h1>
          <p className="text-sm text-white/40">Sign in to access your dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-[#111008] rounded-2xl border border-white/[0.08] p-7 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#b68938]/08 border border-[#b68938]/15 mb-6">
            <Shield size={16} className="text-[#e1ba73] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white/55 leading-relaxed">
              Access is managed through <span className="text-white/80 font-semibold">SRK University</span>. Your session will be transferred automatically.
            </p>
          </div>

          <button
            onClick={handleGoToUniversity}
            className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold text-sm shadow-[0_4px_16px_rgba(182,137,56,0.4)] hover:brightness-110 hover:shadow-[0_6px_24px_rgba(182,137,56,0.55)] transition-all duration-200 group"
          >
            <span>Continue with SRK University</span>
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-150" />
          </button>

          <p className="text-center text-xs text-white/20 mt-5">
            Multi-domain SSO powered by SRK
          </p>
        </div>

      </div>
    </div>
  );
};
