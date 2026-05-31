import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinalCTA = () => (
  <section className="py-28 px-6 bg-[#0a0705] border-t border-white/[0.06] relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#b68938]/[0.07] rounded-full blur-[100px]" />
    </div>

    <div className="max-w-2xl mx-auto text-center relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b68938]/10 border border-[#b68938]/20 text-[#e1ba73] text-xs font-semibold mb-6">
        Get started today
      </div>
      <h2 className="text-5xl font-black text-white tracking-tight leading-[1.1] mb-5">
        Ready to start<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] to-[#b68938]">progressing?</span>
      </h2>
      <p className="text-base text-white/45 leading-relaxed max-w-md mx-auto mb-10">
        Join thousands of verified members completing tasks and building real
        progress. No experience required — start today.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
        <Link
          to="/task/dashboard"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold text-sm shadow-[0_4px_24px_rgba(182,137,56,0.5)] hover:brightness-110 hover:shadow-[0_6px_32px_rgba(182,137,56,0.6)] transition-all duration-200"
        >
          Start progressing <ArrowRight size={16} />
        </Link>
        <Link
          to="/how-it-works"
          className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-white/[0.12] text-white/55 text-sm font-medium hover:border-white/[0.22] hover:text-white/80 transition-all duration-150"
        >
          How it works
        </Link>
      </div>

      <p className="flex items-center justify-center gap-2 text-xs text-white/25">
        <ShieldCheck size={13} className="text-[#b68938]/50" />
        Trusted by 50,000+ members worldwide. No hidden fees.
      </p>
    </div>
  </section>
);
