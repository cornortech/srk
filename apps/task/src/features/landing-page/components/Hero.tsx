import { ArrowRight, Coins, Shield, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  { num: '01', title: 'Enroll', desc: 'Join SRK University', icon: Users },
  { num: '02', title: 'Verify', desc: 'Complete KYC process', icon: Shield },
  { num: '03', title: 'Link', desc: 'Connect to SRK Task', icon: Target },
  { num: '04', title: 'Progress', desc: 'Complete tasks & earn', icon: Coins },
];

export const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-24 pb-20 px-6 bg-[#0a0705] overflow-hidden">
    {/* Subtle warm glow in background */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[400px] bg-[#b68938]/[0.06] rounded-full blur-[120px]" />
    </div>

    <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center relative z-10">

      {/* Left */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b68938]/10 border border-[#b68938]/20 text-[#e1ba73] text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e1ba73] animate-pulse" />
          SRK Task Platform
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-[1.05] mb-6">
          Earn through<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1ba73] to-[#b68938]">verified tasks</span>
        </h1>
        <p className="text-base text-white/50 leading-relaxed max-w-md mb-10">
          Complete social engagement tasks, accumulate coins, and convert them
          to real payouts. Built exclusively for verified SRK University members.
        </p>

        <div className="flex flex-col sm:flex-row items-start gap-3 mb-14">
          <Link
            to="/task/dashboard"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold text-sm shadow-[0_4px_20px_rgba(182,137,56,0.45)] hover:brightness-110 hover:shadow-[0_6px_28px_rgba(182,137,56,0.55)] transition-all duration-200"
          >
            Start progressing <ArrowRight size={16} />
          </Link>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.12] text-white/55 text-sm font-medium hover:border-white/[0.22] hover:text-white/80 transition-all duration-150"
          >
            How it works
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/30">
          <span>10,000+ verified members</span>
          <span className="hidden sm:block w-px h-3.5 bg-white/15" />
          <span>50,000+ tasks completed</span>
          <span className="hidden sm:block w-px h-3.5 bg-white/15" />
          <span>99.8% approval rate</span>
        </div>
      </div>

      {/* Right — steps */}
      <div className="hidden lg:block">
        <div className="bg-[#111008] rounded-2xl border border-white/[0.07] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`flex items-center gap-4 px-6 py-5 ${i < steps.length - 1 ? 'border-b border-white/[0.06]' : ''} hover:bg-white/[0.03] transition-colors duration-150`}
              >
                <div className="w-9 h-9 rounded-lg bg-[#b68938]/10 border border-[#b68938]/15 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-[#e1ba73]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/90">{step.title}</p>
                  <p className="text-xs text-white/35 mt-0.5">{step.desc}</p>
                </div>
                <span className="font-mono text-xs text-white/20 flex-shrink-0">{step.num}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  </section>
);
