import { Globe, Target, Users, Wallet } from 'lucide-react';

const stats = [
  { value: '10,000+', label: 'Verified members', sub: 'KYC-verified via SRK University', icon: Users },
  { value: '50,000+', label: 'Tasks completed', sub: 'Verified engagement tasks', icon: Target },
  { value: '99.8%', label: 'Approval rate', sub: 'Honest verified submissions', icon: Wallet },
  { value: '24/7', label: 'Support', sub: 'Live chat and email anytime', icon: Globe },
];

export const StatsBar = () => (
  <section className="py-16 bg-[#0a0705] border-t border-white/[0.06]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#111008] rounded-xl border border-white/[0.07] p-6 hover:border-[#b68938]/20 transition-colors duration-200"
            >
              <div className="p-2 rounded-lg bg-[#b68938]/10 border border-[#b68938]/15 w-fit mb-4">
                <Icon size={14} className="text-[#e1ba73]" />
              </div>
              <p className="text-3xl font-black text-white tabular-nums mb-1">{stat.value}</p>
              <p className="text-sm font-semibold text-white/60 mb-0.5">{stat.label}</p>
              <p className="text-xs text-white/25 leading-relaxed">{stat.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
