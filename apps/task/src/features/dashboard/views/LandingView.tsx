import React from 'react';
import { ArrowRight, Shield, TrendingUp, Zap } from 'lucide-react';

interface LandingViewProps {
  setView: (view: 'dashboard') => void;
  addNotification: (message: string, type: 'success') => void;
}

const features = [
  { icon: Zap, title: 'Instant Rewards', desc: 'Coins credited immediately after each verified task completes.' },
  { icon: Shield, title: 'Verified Tasks', desc: 'Every task is reviewed for authenticity before reaching you.' },
  { icon: TrendingUp, title: 'Growth Opportunities', desc: 'Unlock higher-value tasks and multipliers with SRK Grow.' },
];

const stats = [
  { value: '10K+', label: 'Active users' },
  { value: '500K+', label: 'Coins earned' },
  { value: '98%', label: 'Success rate' },
  { value: '24/7', label: 'Support' },
];

export const LandingView: React.FC<LandingViewProps> = ({ setView, addNotification }) => (
  <div className="py-10">

    {/* Hero */}
    <div className="max-w-lg mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b68938]/10 border border-[#b68938]/20 text-[#e1ba73] text-xs font-semibold mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e1ba73] animate-pulse" />
        SRK Portal · Earn Through Tasks
      </div>
      <h1 className="text-4xl font-black text-white tracking-tight leading-[1.1] mb-4">
        Complete tasks,<br />earn real coins.
      </h1>
      <p className="text-base text-white/50 leading-relaxed mb-8">
        Complete verified social tasks, accumulate coins, and convert them to
        real payouts. Transparent, consistent, and built for scale.
      </p>
      <button
        onClick={() => { setView('dashboard'); addNotification('Welcome to SRK Portal!', 'success'); }}
        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#e1ba73] to-[#b68938] text-black font-bold text-sm shadow-[0_4px_16px_rgba(182,137,56,0.4)] hover:shadow-[0_6px_24px_rgba(182,137,56,0.5)] hover:brightness-105 transition-all duration-200"
      >
        Enter Dashboard
        <ArrowRight size={16} />
      </button>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {stats.map(stat => (
        <div key={stat.label} className="bg-[#111008] rounded-xl border border-white/[0.07] px-5 py-4">
          <p className="text-2xl font-black text-white tabular-nums mb-0.5">{stat.value}</p>
          <p className="text-xs text-white/35 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Feature cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {features.map(feature => {
        const Icon = feature.icon;
        return (
          <div
            key={feature.title}
            className="bg-[#111008] rounded-xl border border-white/[0.07] p-6 hover:border-[#b68938]/20 transition-colors duration-200"
          >
            <div className="p-2.5 rounded-lg bg-[#b68938]/10 border border-[#b68938]/15 w-fit mb-4">
              <Icon size={16} className="text-[#e1ba73]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">{feature.title}</h3>
            <p className="text-sm text-white/45 leading-relaxed">{feature.desc}</p>
          </div>
        );
      })}
    </div>

  </div>
);
