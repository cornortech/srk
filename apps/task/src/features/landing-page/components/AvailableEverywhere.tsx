import { Server, Smartphone, Users, Wifi } from 'lucide-react';

const features = [
  { icon: Smartphone, title: 'Universal access', desc: 'Works on iOS, Android, and any web browser seamlessly.' },
  { icon: Wifi, title: 'Low latency', desc: 'Optimized for 4G/5G with real-time synchronization.' },
  { icon: Server, title: 'Secure transactions', desc: 'Bank-grade encryption protects every coin transfer and payout.' },
];

export const AvailableEverywhere = () => (
  <section className="py-24 px-6 bg-[#0a0705] border-t border-white/[0.06]">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

      {/* Text */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b68938]/10 border border-[#b68938]/20 text-[#e1ba73] text-xs font-semibold mb-6">
          Platform
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight leading-[1.1] mb-4">
          Available everywhere
        </h2>
        <p className="text-base text-white/45 leading-relaxed mb-8 max-w-md">
          Your progress potential travels with you. Access thousands of verified
          tasks instantly from any device, any time.
        </p>

        <div className="flex flex-col gap-3">
          {features.map(feature => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-[#111008] border border-white/[0.07] hover:border-[#b68938]/20 transition-colors duration-200"
              >
                <div className="p-2 rounded-lg bg-[#b68938]/10 border border-[#b68938]/15 flex-shrink-0 mt-0.5">
                  <Icon size={14} className="text-[#e1ba73]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white/90 mb-0.5">{feature.title}</p>
                  <p className="text-sm text-white/40">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phone mockup */}
      <div className="flex justify-center lg:justify-end">
        <div className="w-64 bg-[#111008] rounded-2xl border border-white/[0.08] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.5)]">

          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#e1ba73] to-[#b68938] flex items-center justify-center">
                <span className="text-black text-[9px] font-black">S</span>
              </div>
              <span className="text-xs font-bold text-white">SRK Task</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-medium">Live</span>
            </div>
          </div>

          <div className="px-4 py-5 border-b border-white/[0.06] bg-gradient-to-br from-[#1a1408]/80 to-[#111008]">
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Total balance</p>
            <p className="text-3xl font-black text-white tabular-nums leading-none">₹24,500</p>
            <p className="text-xs text-white/30 mt-1.5">24,500 coins · 245 eligible</p>
          </div>

          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-white/25 uppercase tracking-widest">Recent tasks</p>
              <Users size={10} className="text-white/20" />
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Instagram follow', coins: '+50', time: 'Just now' },
                { label: 'YouTube view', coins: '+75', time: '5m ago' },
                { label: 'Comment task', coins: '+35', time: '10m ago' },
              ].map(task => (
                <div key={task.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white/70">{task.label}</p>
                    <p className="text-[10px] text-white/25">{task.time}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 tabular-nums">{task.coins}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-white/[0.06]">
            <button className="py-3.5 text-xs font-bold text-[#e1ba73] bg-[#b68938]/10 hover:bg-[#b68938]/20 transition-colors">Withdraw</button>
            <button className="py-3.5 text-xs font-semibold text-white/35 border-l border-white/[0.06] hover:bg-white/[0.04] transition-colors">History</button>
          </div>

        </div>
      </div>

    </div>
  </section>
);
